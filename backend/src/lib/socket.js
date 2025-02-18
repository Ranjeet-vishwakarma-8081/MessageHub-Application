import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

// Used to store Online users
const userSocketMap = {}; // { userId : socketId } //userId from Database and socketId come from socket

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

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${userId}`);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };
