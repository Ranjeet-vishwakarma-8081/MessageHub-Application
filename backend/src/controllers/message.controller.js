import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io, activeChats } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar : ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params; // id renamed to userToChatId
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages controller : ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();

    // If User B is NOT actively chatting with User A, save notification
    const receiverChatWith = activeChats.get(receiverId);
    if (receiverChatWith !== senderId.toString()) {
      // Update notification count for receiver
      await User.findByIdAndUpdate(receiverId, {
        $inc: { [`notifications.${senderId}`]: 1 },
      });
    }
    // TODO: Realtime functionality goes here => socket.io
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage); // For 1x1 Chat
    }
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller : ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const resetNotification = async (req, res) => {
  try {
    const { id: authUserId } = req.params;
    const { senderId } = req.body;

    await User.findByIdAndUpdate(authUserId, {
      $unset: { [`notifications.${senderId}`]: "" },
    });
    res.status(200).json({ message: "Notification reset successfully" });
  } catch (error) {
    console.error("Error in reset notification route : ", error.message);
    res.status(500).json({ error: "Failed to reset notifications" });
  }
};
