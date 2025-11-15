import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const checkAuth = (req, res) => {
  try {
    const user = req.user;
    res
      .status(200)
      .json({ message: "Authenticated successfully", authUser: user });
  } catch (error) {
    console.error("Error in checkAuth controller -", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  const safeEmail = String(email).trim().toLowerCase();

  try {
    if (!fullName || !safeEmail || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const UserFullName = await User.findOne({ fullName });
    if (UserFullName) {
      return res
        .status(400)
        .json({ message: "This username is already taken. Try another one" });
    }
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(safeEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at-least 6 characters" });
    }
    const user = await User.findOne({ email: safeEmail });
    if (user) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email: safeEmail,
      password: hashedPassword,
    });

    if (newUser) {
      //Generate JWT token here
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        message: "Account created successfully",
        authUser: {
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePic: newUser.profilePic,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
        },
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  const safeEmail = String(email).trim().toLowerCase();

  try {
    if (!safeEmail || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(safeEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at-least 6 characters" });
    }
    const user = await User.findOne({ email: safeEmail });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with this email" });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    //Generate JWT token here
    generateToken(user._id, res);
    res.status(200).json({
      message: "Logged in successfully",
      authUser: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        notifications: user.notifications,
      },
    });
  } catch (error) {
    console.error("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const user = req.user; // this could be possible due to our protectRoute middleware
    const UserId = user._id;

    if (!profilePic) {
      return res
        .status(400)
        .json({ message: "Profile picture is required", authUser: user });
    }
    const uploadImageResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      UserId,
      { profilePic: uploadImageResponse.secure_url },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "Profile updated successfully", updatedUser });
  } catch (error) {
    console.error("Error in updateProfile controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
