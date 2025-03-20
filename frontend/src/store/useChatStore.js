import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios.js";
import useAuthStore from "./useAuthStore.js";

const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  selectedCamera: false,
  imagePreview: null,
  lastSeenTime: null,
  lastSeenDate: null,
  notifications: {},
  isMessageSending: false,
  recentChats: [],
  setRecentChats: (user) => {
    set((prev) => {
      const updatedChats = prev.recentChats.filter((u) => u._id !== user._id);
      return { recentChats: [user, ...updatedChats] };
    });
  },
  setIsMessageSending: (messageSending) => {
    set({ isMessageSending: messageSending });
  },
  setNotifications: (authUserNotifications) => {
    set((prev) => ({
      notifications: {
        ...prev.notifications, // Preserve real-time updates
        ...authUserNotifications, // Sync with DB
      },
    }));
  },
  incrementNotification: (senderId) => {
    set((prev) => ({
      notifications: {
        ...prev.notifications,
        [senderId]: (prev.notifications[senderId] || 0) + 1,
      },
    }));
  },
  clearNotification: (userId) => {
    set((prev) => {
      const newNotifications = { ...prev.notifications };
      delete newNotifications[userId]; // Remove notification count for particular user
      return { notifications: newNotifications };
    });
  },
  setLastSeenTime: (time) => {
    set({ lastSeenTime: time });
  },
  setLastSeenDate: (date) => {
    set({ lastSeenDate: date });
  },

  setImagePreview: (image) => {
    set({ imagePreview: image });
  },
  setSelectedCamera: (cameraValue) => {
    set({ selectedCamera: cameraValue });
  },

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      console.error(error.message);
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get(); //This is how, we can use the state varible inside the zustand store.

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  },
  setSelectedUser: (selectedNewUser) => set({ selectedUser: selectedNewUser }),

  resetNotifications: async (authUserId, senderId) => {
    try {
      await axiosInstance.patch(`/messages/reset-notification/${authUserId}`, {
        senderId,
      });
    } catch (error) {
      console.error("Error in reset notification route : ", error.message);
      toast.error(error.message);
    }
  },

  // Socket event listener
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;
      set((prevState) => ({
        messages: [...prevState.messages, newMessage],
      }));
    });
  },
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
}));

export default useChatStore;
