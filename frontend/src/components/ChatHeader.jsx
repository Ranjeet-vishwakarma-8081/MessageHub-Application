import { X } from "lucide-react";
import useChatStore from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers, msgSenderName } = useAuthStore();

  return (
    <div className={`${selectedUser && "relative"}`}>
      <div
        className={` ${
          selectedUser && "fixed sm:static inset-x-0 top-0 z-10 "
        }bg-base-100  w-full p-3 border-b border-base-300`}
      >
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
                  : `last seen at ${formatMessageTime(new Date())}`}
              </p>
            </div>
          </div>
          {/* Close Button */}
          <button onClick={() => setSelectedUser(null)} className="mr-4">
            <X />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
