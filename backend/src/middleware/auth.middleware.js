import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import process from "process";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; // Here jwt is the cookie name
    if (!token) {
      return res
        .status(401)
        .json({ message: "Un-Authorized - No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Un-Authorized - Invalid Token" });
    }
    const user = await User.findById(decoded.userId).select("-password"); //This is how we can de-select the password since it wouldn't be secure
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware -", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
