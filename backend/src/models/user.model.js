import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    lastSeen: {
      type: Date,
      default: "",
    },
    notifications: {
      type: Map,
      of: Number,  //stores unread count for each sender
      default: {}, // { senderUserId : value }
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
