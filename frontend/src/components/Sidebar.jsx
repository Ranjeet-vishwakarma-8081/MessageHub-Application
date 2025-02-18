import { useEffect, useState } from "react";
import { Lock, Users } from "lucide-react";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import useChatStore from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();
  const { onlineUsers, socket, setMsgSenderName, msgSenderName } =
    useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    if (!socket) return;
    socket.on("userTyping", ({ senderName }) => {
      setMsgSenderName(senderName);
    });
    socket.on("userStoppedTyping", () => {
      setMsgSenderName("");
    });
    return () => {
      socket.off("userTyping");
      socket.off("userStoppedTyping");
    };
  }, [socket, setMsgSenderName]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;
  if (isUsersLoading) return <SidebarSkeleton />;
  return (
    <aside className="flex flex-col w-20 h-full transition-all duration-200 border-r lg:w-72 border-base-300">
      {/* Header */}
      <div className="w-full p-5 border-b border-base-300">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="hidden font-medium lg:block">Contacts</span>
        </div>
        {/* Online Users */}
        <div className="items-center hidden gap-2 mt-3 lg:flex">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>
      <div className="w-full py-3 overflow-y-auto">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
                w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
                  selectedUser?._id === user._id
                    ? " bg-base-200 ring-1 ring-base-300"
                    : ""
                }
                `}
          >
            {/* User avatar - visible on all screens */}
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt="user.name"
                className="object-cover rounded-full size-12"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 bg-green-500 rounded-full ring-2 size-3 ring-zinc-900" />
              )}
            </div>
            {/* User info - Only visible on larger screens */}
            <div className="hidden min-w-0 text-left lg:block">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) &&
                user.fullName.split(" ")[0] !== msgSenderName
                  ? "Online"
                  : user.fullName.split(" ")[0] === msgSenderName
                  ? `${msgSenderName} is typing...`
                  : "offline"}
              </div>
            </div>
          </button>
        ))}
        {filteredUsers.length === 0 && (
          <div className="py-4 text-sm text-center text-zinc-500">
            No online user found!
          </div>
        )}
        {filteredUsers.length !== 0 && (
          <div className="px-6 py-4 text-xs text-zinc-500 ">
            <div className="flex justify-center">
              <Lock size="12" />
              <div className="pl-1">
                Your personal messages are{" "}
                <span className="text-green-600">end-to-end encrypted.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
