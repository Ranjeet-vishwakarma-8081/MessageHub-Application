import { X } from "lucide-react";
import useChatStore from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers, msgSenderName } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="relative rounded-full size-10">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
              />
            </div>
          </div>
          {/* User Info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) &&
              selectedUser.fullName.split(" ")[0] !== msgSenderName
                ? "Online"
                : selectedUser.fullName.split(" ")[0] === msgSenderName
                ? `${msgSenderName} is typing...`
                : "offline"}
            </p>
          </div>
        </div>
        {/* Close Button */}
        <button onClick={() => setSelectedUser(null)} className="mr-4">
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
