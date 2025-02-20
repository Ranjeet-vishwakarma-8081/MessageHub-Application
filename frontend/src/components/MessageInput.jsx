import { useRef, useState } from "react";
import useChatStore from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import useAuthStore from "../store/useAuthStore";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { socket, authUser } = useAuthStore();
  const { sendMessage, selectedUser } = useChatStore();

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
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      handleStopTyping(); // Stop typing when message is sent
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Failed to send message -", error.message);
    }
  };
  let typingTimeout;
  const handleTyping = () => {
    clearTimeout(typingTimeout); 
    const receiverId = selectedUser._id;
    const senderName = authUser.fullName.split(" ")[0];
    
    socket.emit("typing", { receiverId, senderName });
    // Stop typing automatically after 2 seconds of inactivity
    typingTimeout = setTimeout(() => {
      socket.emit("stopTyping", { receiverId });
  }, 2000);
  };
  const handleStopTyping = () => {
    const receiverId = selectedUser._id;
    socket.emit("stopTyping", { receiverId });
  };

  return (
    <div className="w-full p-4">
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
          <input
            type="text"
            className="w-full rounded-full input input-bordered input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              handleTyping();
            }}
            onBlur={handleStopTyping} // When user clicks away
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
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

export default MessageInput;
