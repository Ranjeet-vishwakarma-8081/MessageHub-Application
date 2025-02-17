import mongoose from "mongoose";
import process from "process";
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.name}`);
  } catch (error) {
    console.log(`MongoDB connection error - ${error}`);
  }
};

export default connectDB;
