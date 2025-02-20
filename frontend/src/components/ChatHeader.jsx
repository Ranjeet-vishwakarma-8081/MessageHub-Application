import { ArrowLeft, X } from "lucide-react";
import useChatStore from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers, msgSenderName } = useAuthStore();

  return (
    <div
      className={` ${
        selectedUser &&
        "fixed sm:static inset-x-0 top-0 z-10 pt-[env(safe-area-inset-bottom)]"
      } bg-base-100  w-full p-3 pt-3 border-b border-base-300`}
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
              {onlineUsers.includes(selectedUser._id) &&
              selectedUser.fullName.split(" ")[0] !== msgSenderName ? (
                <span className="text-green-600">Online</span>
              ) : selectedUser.fullName.split(" ")[0] === msgSenderName ? (
                <span className="text-green-600">
                  {msgSenderName} is typing...
                </span>
              ) : (
                <span className="text-zinc-400">
                  last seen at {formatMessageTime(new Date())}
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
