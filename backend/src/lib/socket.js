import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import User from "../models/user.model.js";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

// Used to store Online users
const userSocketMap = {}; // { userId : socketId } //userId from Database and socketId come from socket
export const activeChats = new Map(); // { userB_id: userA_id }

export const getReceiverSocketId = (userId) => userSocketMap[userId];

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId; // Get the userId from the query parameter from the client BASE_URL
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User connected: ${userId} (Socket ID: ${socket.id})`);
  }
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("typing", ({ receiverId, senderName }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userTyping", { senderName });
    }
  });

  socket.on("stopTyping", ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userStoppedTyping");
    }
  });

  socket.on("chat-opened", ({ userId, chatWith }) => {
    activeChats.set(userId, chatWith);
  });

  socket.on("chat-closed", ({ userId, chatWith }) => {
    if (activeChats.get(userId) === chatWith) activeChats.delete(userId);
  });

  socket.on("disconnect", async (reason) => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); //Notify others that who is online now
    try {
      const lastSeen = new Date();
      await User.findByIdAndUpdate(userId, { lastSeen });
      io.emit("update-last-seen", { userId, lastSeen });
    } catch (err) {
      console.log("Error in updating lastseen during disconnection: ", err);
    }
    console.log(`User disconnected: ${userId}, Reason: ${reason}`);
  });
});

export { app, server, io };
