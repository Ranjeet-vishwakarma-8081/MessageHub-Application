import { ArrowLeft, X } from "lucide-react";
import useChatStore from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";
import { formatDate, formatMessageTime } from "../lib/utils";
import { useEffect } from "react";

const ChatHeader = () => {
  const {
    selectedUser,
    setSelectedUser,
    lastSeenTime,
    setLastSeenTime,
    lastSeenDate,
    setLastSeenDate,
  } = useChatStore();
  const { authUser, onlineUsers, socket } = useAuthStore();

  useEffect(() => {
    // Fetch lastSeen from the selectedUser
    setLastSeenTime(formatMessageTime(selectedUser.lastSeen));
    setLastSeenDate(formatDate(selectedUser.lastSeen));

    // Listen for real-time update lastSeen
    socket.on("update-last-seen", ({ userId: updatedUserId, lastSeen }) => {
      if (updatedUserId === selectedUser._id) {
        setLastSeenTime(formatMessageTime(lastSeen));
        setLastSeenDate(formatDate(lastSeen));
      }
    });

    return () => {
      socket.off("update-last-seen");
    };
  }, [selectedUser, socket, setLastSeenTime, setLastSeenDate]);

  useEffect(() => {
    if (selectedUser)
      socket.emit("chat-opened", {
        userId: authUser._id,
        chatWith: selectedUser._id,
      });

    return () =>
      socket.emit("chat-closed", {
        userId: authUser._id,
        chatWith: selectedUser?._id,
      });
  }, [selectedUser, socket, authUser]);

  return (
    <div
      className={` ${
        selectedUser && "fixed sm:static inset-x-0 top-0 z-10"
      } bg-base-100  w-full p-3  border-b border-base-300`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Back Button */}
          <button onClick={() => setSelectedUser(null)}>
            <ArrowLeft />
          </button>
          {/* Avatar */}
          <div className="avatar ">
            <div className="relative rounded-full size-10">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
              />
            </div>
          </div>
          {/* User Info */}
          <div className="pl-3">
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm">
              {onlineUsers.includes(selectedUser._id) ? (
                <span className="text-green-600">Online</span>
              ) : (
                <span className="text-zinc-400">
                  last seen {lastSeenDate?.toLowerCase()} at {lastSeenTime}
                </span>
              )}
            </p>
          </div>
        </div>
        {/* Close Button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
