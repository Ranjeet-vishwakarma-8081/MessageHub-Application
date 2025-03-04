import { useEffect, useRef, useState } from "react";
import useChatStore from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";

import ChatHeader from "./ChatHeader.jsx";
import MessageInput from "./MessageInput.jsx";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils.js";
import { Lock } from "lucide-react";

const ChatContainer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState("100vh");
  const [isMessageTyping, setIsMessageTyping] = useState(false);

  const SHORT_LIMIT = 500; // Show only 500 characters initially
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser, msgSenderName } = useAuthStore();
  const bottomRef = useRef(null);

  // Check message typing status
  useEffect(() => {
    const bool = selectedUser.fullName.split(" ")[0] === msgSenderName;
    setIsMessageTyping(bool);
  }, [msgSenderName, selectedUser]);

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

  // useEffect triggers when messages or typing indicator changes
  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "instant" });
  }, [isMessageTyping, messages]);

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
        className="flex-1 px-4 pt-4 my-16 space-y-2 overflow-y-auto sm:my-0"
        style={{
          paddingBottom: keyboardHeight ? "80px" : "",
        }}
      >
        {/* Encryption message */}
        <div className="w-4/5 px-2 py-1 mx-auto rounded-lg md:w-3/5 bg-base-200 ">
          <div className="relative text-zinc-500">
            <div>
              <Lock className="absolute top-0 left-0 size-3" />
            </div>
            <p className="text-xs">
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
              {message.text && (
                <div>
                  <p>
                    {isExpanded
                      ? message.text
                      : message.text.slice(0, SHORT_LIMIT) +
                        (message.text.length > SHORT_LIMIT ? "..." : "")}
                    {message.text.length > SHORT_LIMIT && (
                      <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-blue-500"
                      >
                        {!isExpanded && "Read more"}
                      </button>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isMessageTyping && (
          <div className="chat chat-start animate-slideUpDown">
            {/* Avatar */}
            <div className="avatar chat-image">
              <div className="border rounded-full size-10">
                <img
                  src={selectedUser.profilePic || "/avatar.png"}
                  alt="picture"
                />
              </div>
            </div>
            {/* Indicator */}
            <div className="pt-5 chat-bubble text-base-content/70 bg-base-300">
              <div className="flex space-x-1 animate-pulse">
                <div className="bg-gray-500 rounded-full size-2 animate-bounce-1"></div>
                <div className="bg-gray-500 rounded-full size-2 animate-bounce-2"></div>
                <div className="bg-gray-500 rounded-full size-2 animate-bounce-3"></div>
              </div>
            </div>
          </div>
        )}

        {/* Dummy element to scroll into view */}
        <div ref={bottomRef} />
      </div>
      {/* Message Input */}
      <MessageInput keyboardHeight={keyboardHeight} />
    </div>
  );
};

export default ChatContainer;
