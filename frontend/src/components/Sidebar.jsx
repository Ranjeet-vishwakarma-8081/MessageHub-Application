import { useCallback, useEffect, useRef, useState } from "react";
import { Lock, Search } from "lucide-react";
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
    messageCounter,
    newMessageSenderId,
    setNewMessageSenderId,
    resetNotifications,
    notifications,
    setNotifications,
    incrementNotification,
    clearNotification,
  } = useChatStore();
  const { onlineUsers, socket, setMsgSenderName, msgSenderName, authUser } =
    useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const searchRef = useRef("");

  // Dynamically change the application title
  useEffect(() => {
    // document.title = selectedUser? selectedUser.fullName : "MessageHub | Realtime Chat Application";
    document.title =
      messageCounter >= 1
        ? selectedUser
          ? selectedUser.fullName
          : `(${messageCounter}) MessageHub | Realtime Chat Application`
        : "MessageHub | Realtime Chat Application";
  }, [selectedUser, messageCounter]);

  useEffect(() => {
    // Get all authUser's notifications
    const AuthUser = users.filter((user) => user._id === authUser._id);
    if (AuthUser[0]?.notifications !== undefined) {
      setNotifications(AuthUser[0]?.notifications);
    }
    socket.on("newMessage", (newMessage) => {
      if (selectedUser?._id === newMessage.senderId) {
        // If receiver is already chatting with sender, don't update the notification
        return;
      }
      incrementNotification(newMessage.senderId);
      setNewMessageSenderId(newMessage.senderId);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [
    authUser,
    setNewMessageSenderId,
    socket,
    setNotifications,
    selectedUser,
    incrementNotification,
    users,
  ]);

  const filterUsers = useCallback(() => {
    const searchTerm = searchRef.current?.value?.toLowerCase();

    let filtered = showOnlineOnly
      ? users.filter((user) => onlineUsers.includes(user._id))
      : users.filter((user) => user._id !== authUser._id); // Except the authUser

    if (searchTerm) {
      filtered = filtered.filter((user) =>
        user.fullName.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredUsers(filtered);
  }, [users, onlineUsers, showOnlineOnly, authUser]);

  // fetch users on componenet mount
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    filterUsers();
  }, [filterUsers]);

  useEffect(() => {
    if (!socket) return;
    socket.on("userTyping", ({ senderName }) => setMsgSenderName(senderName));
    socket.on("userStoppedTyping", () => setMsgSenderName(""));
    return () => {
      socket.off("userTyping");
      socket.off("userStoppedTyping");
    };
  }, [socket, setMsgSenderName]);

  const handleUserClick = async (user) => {
    if (notifications[user._id]) {
      try {
        // notification reset in MongoDB
        await resetNotifications(authUser._id, newMessageSenderId || user._id);
        // Remove notification for this user in local state
        clearNotification(user._id);
        await getUsers();
        setSelectedUser(user);
      } catch (error) {
        console.log("Error in notification clearing - ", error.message);
      }
    } else {
      await getUsers();
      setSelectedUser(user);
    }
  };

  if (isUsersLoading) return <SidebarSkeleton />;
  return (
    <aside
      className={`${
        selectedUser ? "hidden md:flex " : "flex"
      } flex-col h-full transition-all duration-200 md:border-r w-96 md:max-w-80 border-base-300`}
    >
      {/* Header */}
      <div className="w-full p-4 space-y-3 border-b border-base-300">
        {/* Search Input */}
        <div className="relative ">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className=" size-5 text-base-content/40" />
          </div>
          <input
            type="text"
            className="w-full pl-10 rounded-full input input-bordered input-md focus:outline-none placeholder:text-xs sm:placeholder:text-sm"
            placeholder="Start typing to find contacts"
            ref={searchRef}
            onChange={filterUsers}
            name="search"
          />
        </div>
        {/* Online Users Toggle*/}
        <div className="flex items-center gap-2 ">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => {
                setShowOnlineOnly(e.target.checked);
                filterUsers(); // Apply filter when toggled
              }}
              className="checkbox checkbox-sm"
              name="checkbox"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length > 0 ? onlineUsers.length - 1 : "0"} online)
          </span>
        </div>
      </div>
      {/* User details */}
      <div className="w-full pt-2 overflow-y-auto">
        {filteredUsers.length > 0 &&
          filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => handleUserClick(user)}
              className={`
                p-3 gap-3 w-full flex hover:bg-base-300 transition-colors max-h-16 relative ${
                  selectedUser?._id === user._id
                    ? " bg-base-200 ring-1 ring-base-300"
                    : ""
                }
                `}
            >
              {/* User avatar */}
              <div className="relative">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt="user.fullName"
                  className="object-cover rounded-full size-12"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bg-green-600 rounded-full -bottom-1 -right-1 ring-1 size-3 ring-zinc-200" />
                )}
              </div>
              {/* User info */}
              <div className="text-left">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm">
                  {onlineUsers.includes(user._id) &&
                  user.fullName.split(" ")[0] !== msgSenderName ? (
                    <span className="text-green-600">Online</span>
                  ) : user.fullName.split(" ")[0] === msgSenderName ? (
                    <span className="text-green-600">
                      {msgSenderName} is typing...
                    </span>
                  ) : (
                    <span className="text-zinc-400">Offline</span>
                  )}
                </div>
              </div>

              {/* Notification counter */}
              {notifications?.[user._id] &&
                !Object.keys(notifications).includes(selectedUser?._id) && (
                  <div className="absolute inset-y-0 flex items-center right-5">
                    <div className="px-2 py-1 text-xs font-medium text-black bg-green-500 rounded-full">
                      {notifications[user._id]}
                    </div>
                  </div>
                )}
            </button>
          ))}
      </div>
      {filteredUsers?.length === 0 ? (
        <div className="pt-24 text-sm text-center text-zinc-500">
          No online user found!
        </div>
      ) : (
        <div className="px-8 py-6">
          <div className="flex items-center justify-center text-gray-700 ">
            <div className="relative">
              <div>
                <Lock className="absolute top-0 left-0 size-3" />
              </div>
              <p className="text-xs">
                &nbsp; &nbsp; &nbsp;Your personal messages are{" "}
                <span className="text-green-600 text-bold">
                  end-to-end encrypted.
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
