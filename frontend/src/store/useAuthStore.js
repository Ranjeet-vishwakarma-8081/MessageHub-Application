import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios.js";

import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

const useAuthStore = create((set, get) => ({
  authUser: null,
  message: "Un-Authorized!",
  isCheckingAuth: true,

  // Socket states
  socket: null,
  onlineUsers: [],
  msgSenderName:null,

  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data.authUser, message: res.data.message });

      // Connect to socket
      get().connectSocket();
    } catch (err) {
      console.log("Error in checkAuth -", err.message);
      // set({ authUser: null, message: err.response.data.message });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    set({
      isSigningUp: true,
    });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data.authUser, message: res.data.message });
      toast.success(res.data.message);

      // Connect to socket
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error.message);
      set({ authUser: null, message: error.response.data.message });
    } finally {
      set({
        isSigningUp: false,
      });
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data.authUser, message: res.data.message });
      toast.success(res.data.message);

      // Connect to socket
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
      set({ authUser: null, message: error.response.data.message });
    } finally {
      set({ isLoggingIn: false });
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({
        authUser: res.data.authUser || res.data.updatedUser,
        message: res.data.message,
      });
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error in updating profile -", error);
      toast.error(error.res.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  logout: async () => {
    try {
      const res = await axiosInstance.post("/auth/logout");
      set({ authUser: null, message: res.data.message });
      toast.success("Logged out successfully");

      // Disconnect to socket
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
      set({ authUser: null, message: error.response.data.message });
    }
  },
  setMsgSenderName: (senderName)=>{
    set({ msgSenderName: senderName });
  },
  // Socket Implementation
  connectSocket: () => {
    const { authUser } = get();
    // Optimization
    if (!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    })
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));

export default useAuthStore;
