import { useEffect, useState } from "react";
import { Lock, Users } from "lucide-react";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import useChatStore from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
  } = useChatStore();
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
    <aside
      className={`${
        selectedUser ? "hidden md:flex " : "flex"
      } flex-col h-full transition-all duration-200 border-r w-96 md:max-w-80 border-base-300`}
    >
      {/* Header */}
      <div className="w-full p-4 border-b border-base-300">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium">Contacts</span>
        </div>
        {/* Online Users */}
        <div className="flex items-center gap-2 mt-3 ">
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
        {/* Search Input */}
        <div className="flex items-center mt-3">
          <input
            type="text"
            className="w-full rounded-lg input input-bordered input-sm"
            placeholder="Start typing to find contacts..."
          ></input>
        </div>
      </div>
      {/* User details */}
      <div className="w-full pt-2 overflow-y-auto">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
                p-3 gap-3 w-full flex hover:bg-base-300 transition-colors max-h-16 ${
                  selectedUser?._id === user._id
                    ? " bg-base-200 ring-1 ring-base-300"
                    : ""
                }
                `}
          >
            {/* User avatar - visible on all screens */}
            <div className="relative">
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
            <div className="text-left">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400 ">
                {
                  onlineUsers.includes(user._id) &&
                  user.fullName.split(" ")[0] !== msgSenderName
                    ? "Online"
                    : user.fullName.split(" ")[0] === msgSenderName
                    ? `${msgSenderName} is typing...`
                    : "Offline"
                }
              </div>
            </div>
          </button>
        ))}
      </div>
      {filteredUsers.length === 0 ? (
        <div className="py-4 text-sm text-center text-zinc-500">
          No online user found!
        </div>
      ) : (
        <div className="px-8 py-6 text-zinc-500 ">
          <div className="flex justify-center">
            <Lock size="13" />
            <div className="pl-1 text-xs text-center">
              Your personal messages are{" "}
              <span className="text-green-600 text-bold">
                end-to-end encrypted.
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
