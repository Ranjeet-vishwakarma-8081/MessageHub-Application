import express from "express";
// import dotenv from "dotenv";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import process from "process";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import connectDB from "./lib/db.js";
import { app, server } from "./lib/socket.js";

// dotenv.config();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

app.use(
  express.json({
    limit: "5mb", // Limit the size of incoming JSON data to 5MB
  })
);
// Error-handling middleware
app.use((err, req, res, next) => {
  if (err.type === "entity.too.large") {
    res.status(413).json({ message: "Payload too large" });
    console.error("Payload too large");
  } else {
    next(err);
  }
});
app.use(cookieParser()); // For parsing cookies
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Specify the hosted URL of your frontend Application
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed HTTP methods
    credentials: true, // Include cookies in requests
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// If we're in Production then make the dist folder to be our static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  // Except the above route if any request comes, then i'll redirect to the frontend index.html file
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
  connectDB();
});
