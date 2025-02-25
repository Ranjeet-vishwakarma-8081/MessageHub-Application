import { Image, Loader, SwitchCamera, X } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate } from "react-router-dom";
import Webcam from "react-webcam";
import useChatStore from "../store/useChatStore";

const CapturePhoto = () => {
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const { imagePreview, setImagePreview } = useChatStore();
  console.log(imagePreview);
  const [facingMode, setFacingMode] = useState("user"); // "user" for front, "environment" for rear
  const [isLoading, setIsLoading] = useState(true);
  const [hasImage, setHasImage] = useState(false);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot(); // This is already a base64 data URL
    setImagePreview(imageSrc); // Directly set the image source
    setHasImage(true);
  };
  const switchCamera = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };
  const handleUserMedia = () => {
    setIsLoading(false); // Webcam is ready
  };
  const handleUserMediaError = () => {
    setIsLoading(false); //stop loading even if there is any error
    toast.error("Unable to access Camera, please check permissions");
  };
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
    setHasImage(true);
  };

  return (
    <div className=" h-screen pt-16 relative bg-black space-y-3">
      {hasImage && <Navigate to={"/"} />}
      {/* Close button */}
      <div className="py-3 px-6 text-zinc-400">
        <Link to={"/"}>
          <X className="size-6 " />
        </Link>
      </div>
      {/* Loading spinner */}
      {isLoading && (
        <div className="flex items-center justify-center h-96 w-full">
          <Loader className="size-15 animate-spin text-white" />
        </div>
      )}
      {/* Webcam component */}
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          facingMode,
          height: 1920,
          width: 1080,
        }}
        onUserMedia={handleUserMedia} // Called when webcam is ready.
        onUserMediaError={handleUserMediaError}
        className={`w-full h-96  ${isLoading ? "hidden" : "block"}`}
      />
      {/* Controls */}
      <div className="flex justify-between items-center py-3 px-6 text-zinc-400 absolute w-full inset-x-0 bottom-16 ">
        {/* Gallery*/}
        <div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
            name="pick_image"
          />
          <button type="button" onClick={() => fileInputRef.current?.click()}>
            <Image className="size-6" />
          </button>
        </div>
        {/* Switch Camera */}
        <button
          onClick={capture}
          className="p-6 bg-white rounded-full ring ring-white ring-offset-4 ring-offset-black"
        />
        <SwitchCamera className="size-6" onClick={switchCamera} />
      </div>
    </div>
  );
};

export default CapturePhoto;
