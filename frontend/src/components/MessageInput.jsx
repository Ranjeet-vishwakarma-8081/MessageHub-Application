import { useRef, useState } from "react";
import useChatStore from "../store/useChatStore";
import { Camera, Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import useAuthStore from "../store/useAuthStore";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const MessageInput = ({ keyboardHeight }) => {
  const [text, setText] = useState("");
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { socket, authUser } = useAuthStore();
  const {
    sendMessage,
    selectedUser,
    setSelectedCamera,
    imagePreview,
    setImagePreview,
  } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a image file");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
    };
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    try {
      handleStopTyping(); // Stop typing when message is sent
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Failed to send message -", error.message);
    }
  };
  const handleTyping = () => {
    const receiverId = selectedUser._id;
    const senderName = authUser.fullName.split(" ")[0];

    // Emit typing event immediately
    socket.emit("typing", { receiverId, senderName });

    // clear any existing typing timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    // Set a new timeout to emit stopTyping after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { receiverId });
    }, 2000);
  };
  const handleStopTyping = () => {
    const receiverId = selectedUser._id;
    socket.emit("stopTyping", { receiverId });
  };

  const handleCamera = () => {
    setSelectedCamera(true);
  };

  const handleInputChange = (e) => {
    const str = e.target.value;
    const capitalizeValue = str.charAt(0).toUpperCase() + str.slice(1);
    setText(capitalizeValue);
    handleTyping();
  };

  return (
    <div
      className={`${
        selectedUser && " fixed sm:static inset-x-0 bottom-0 bg-base-100 "
      } w-full p-3 pb-3`}
      style={{ bottom: `${keyboardHeight}px` }} // Adjust for keyboard height
    >
      {imagePreview && (
        <div className="flex items-center gap-2 mb-3">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="object-cover border rounded-lg size-20 border-zinc-700"
            />
            <button
              type="button"
              className="absolute -top-1.5 -right-1.5 rounded-full bg-base-300 flex items-center justify-center"
              onClick={removeImage}
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}
      {/* Form for handling the input messages */}
      <form className="flex items-center gap-2" onSubmit={handleSendMessage}>
        <div className="flex flex-1 gap-2">
          <div className="relative w-full">
            <div
              className="absolute inset-y-0 right-0 flex items-center pr-3 sm:hidden"
              onClick={handleCamera}
            >
              <Link to="/chat-container/capture-photo">
                <Camera className="size-5 text-base-content/50" />
              </Link>
            </div>
            <input
              type="text"
              className="w-full pr-10 rounded-full sm:pr-4 input input-bordered input-md focus:outline-none"
              placeholder="Type a message"
              value={text}
              onChange={handleInputChange}
              onBlur={handleStopTyping} // When user clicks away
            />
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
            name="pick_image"
          />
          <button
            type="button"
            className={`flex btn btn-circle bg-base-200
            ${imagePreview ? "text-emerald-500" : "text-amber-600"}`}
            onClick={() => fileInputRef.current?.click()} // behind the seen It will call the input element
          >
            <Image className="size-5" />
          </button>
        </div>
        {/* Send button */}
        <button
          type="submit"
          className="btn btn-circle btn-primary"
          disabled={!text.trim() && !imagePreview}
        >
          <Send className="size-5" />
        </button>
      </form>
    </div>
  );
};

MessageInput.propTypes = {
  keyboardHeight: PropTypes.number,
};

export default MessageInput;
