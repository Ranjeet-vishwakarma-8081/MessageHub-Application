import { useEffect, useRef } from "react";
import useChatStore from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";

import ChatHeader from "./ChatHeader.jsx";
import MessageInput from "./MessageInput.jsx";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils.js";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages(); // Clean up when unmounting
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex flex-col flex-1 overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 overflow-auto ">
      {/* Chat header */}
      <ChatHeader />

      {/* Chat Messages */}
      <div className="flex-1 p-4 my-16 space-y-4 overflow-y-auto sm:my-0">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef} // Scroll to bottom when new message arrives
          >
            {/* Avatar */}
            <div className="avatar chat-image">
              <div className="border rounded-full size-10">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile-pic"
                />
              </div>
            </div>
            {/* Header */}
            <div className="mb-1 chat-header">
              <time className="ml-1 text-xs opacity-50">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            {/* messages */}
            <div
              className={`flex flex-col chat-bubble 
              ${
                message.senderId === authUser._id
                  ? "chat-end bg-primary text-primary-content/70"
                  : "chat-start bg-base-300 text-base-content/70"
              }`}
            >
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      {/* Message Input */}
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
