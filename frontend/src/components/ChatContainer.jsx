import { useEffect, useRef, useState } from "react";
import useChatStore from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";

import ChatHeader from "./ChatHeader.jsx";
import MessageInput from "./MessageInput.jsx";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils.js";
import { Lock } from "lucide-react";

const ChatContainer = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState("100vh");

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

  useEffect(() => {
    const handleResize = () => {
      const visualViewportHeight =
        window.visualViewport?.height || window.innerHeight;
      const keyboardHeight = window.innerHeight - visualViewportHeight;
      setKeyboardHeight(keyboardHeight);
    };

    window.visualViewport?.addEventListener("resize", handleResize);
    return () =>
      window.visualViewport?.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    const updateHeight = () => {
      const isSmallScreen = window.innerWidth < 640;
      if (isSmallScreen) {
        // setViewportHeight(`calc(100vh - ${keyboardHeight}px)`);
        setViewportHeight(
          keyboardHeight ? `calc(100vh - ${keyboardHeight}px)` : "100vh"
        );
      } else {
        setViewportHeight("");
      }
    };

    window.addEventListener("resize", updateHeight);
    updateHeight(); // Call on mount

    return () => window.removeEventListener("resize", updateHeight);
  }, [keyboardHeight]);
  if (isMessagesLoading) {
    return (
      <div className="flex flex-col flex-1 pt-16 overflow-auto h-dvh sm:pt-0 sm:h-full">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col flex-1 overflow-auto "
      style={{
        height: viewportHeight,
      }}
    >
      {/* Chat header */}
      <ChatHeader />

      {/* Chat Messages */}
      <div
        className="flex-1 p-4 my-16 space-y-4 overflow-y-auto sm:my-0 "
        style={{
          paddingBottom: keyboardHeight ? "80px" : "",
        }}
      >
        {/* Encryption message */}
        <div className="w-4/5 px-2 py-1 mx-auto rounded-lg md:w-3/5 bg-base-300 ">
          <div className="relative text-zinc-500">
            <div>
              <Lock className="absolute top-0 left-0 size-3" />
            </div>
            <p className="text-xs font-medium">
              &nbsp; &nbsp; &nbsp;To maintain your privacy, all communications
              on MessageHub are encrypted end-to-end, ensuring that no third
              party, including MessageHub, can intercept them.
            </p>
          </div>
        </div>

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
      <MessageInput keyboardHeight={keyboardHeight} />
    </div>
  );
};

export default ChatContainer;
