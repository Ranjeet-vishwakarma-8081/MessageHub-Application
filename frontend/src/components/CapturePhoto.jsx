import { useRef, useState } from "react";
import Webcam from "react-webcam";
import { Camera, SwitchCamera, X, Download } from "lucide-react";

const CapturePhoto = () => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [facingMode, setFacingMode] = useState("user"); // "user" for front, "environment" for rear

  // Get screen width & height dynamically
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // 📸 Capture Photo
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  };

  // 🔄 Switch Camera (Front ↔ Rear)
  const switchCamera = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  // 📥 Download the Captured Image
  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = image;
    link.download = "captured_image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="relative w-full h-screen">
        {image ? (
          <>
            {/* Captured Image Preview */}
            <img
              src={image}
              alt="Captured"
              className="object-cover w-full h-screen"
            />
            <div className="absolute flex gap-4 transform -translate-x-1/2 bottom-10 left-1/2">
              <button
                className="flex items-center gap-2 px-4 py-2 text-white bg-red-500 rounded-full"
                onClick={() => setImage(null)}
              >
                <X size={20} /> Retake
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 text-white bg-blue-500 rounded-full"
                onClick={downloadImage}
              >
                <Download size={20} /> Download
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Webcam Live Preview */}
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/png"
              videoConstraints={{
                facingMode,
                width: screenWidth,
                height: screenHeight,
              }}
              className="object-cover w-full h-screen"
            />
            {/* Buttons */}
            <div className="absolute flex gap-4 transform -translate-x-1/2 bottom-10 left-1/2">
              <button
                className="flex items-center gap-2 px-4 py-2 text-white bg-green-500 rounded-full"
                onClick={capture}
              >
                <Camera size={24} /> Capture
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 text-white bg-gray-500 rounded-full"
                onClick={switchCamera}
              >
                <SwitchCamera size={24} /> Switch
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CapturePhoto;



// import { Image, SwitchCamera, X } from "lucide-react";
// import { useRef, useCallback, useState } from "react";
// import Webcam from "react-webcam";

// const CapturePhoto = () => {
//   const webcamRef = useRef(null);
//   const [image, setImage] = useState(null);
//   console.log(image);
//   const capture = useCallback(() => {
//     const imageSrc = webcamRef.current?.getScreenshot();
//     setImage(imageSrc || null);
//   }, [webcamRef]);

//   const videoConstraints = {
//     width: 1080,
//     height:720,
//   };

//   return (
//     <div className=" h-screen py-12  bg-black space-y-3">
//       <div className="py-3 px-6 text-zinc-400">
//         <X className="size-6 " />
//       </div>
//       <Webcam
//         ref={webcamRef}
//         screenshotFormat="image/jpeg"
//         className="border-2 border-gray-300 rounded-lg"
//         minScreenshotWidth={1280}
//         minScreenshotHeight={720}
//         videoConstraints={videoConstraints}

//       />
//       <div className="flex justify-between items-center py-3 px-6 text-zinc-400">
//         <Image className="size-6" />
//         <button
//           onClick={capture}
//           className="p-6 bg-white rounded-full ring ring-white ring-offset-4 ring-offset-black"
//         />
//         <SwitchCamera className="size-6" />
//       </div>
//       {/* {image && <img src={image} alt="Captured" cla ssName="mt-4 rounded-lg" />} */}
//     </div>
//   );
// };

// export default CapturePhoto;
