import { useState } from "react";
import useAuthStore from "../store/useAuthStore.js";
import { Camera, User, Mail } from "lucide-react";
import imageCompression from "browser-image-compression";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile, setIsUpdatingProfile } =
    useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const fileInput = e.target;
    const file = fileInput.files[0];

    if (!file) {
      console.log("User has cancelled to upload image");
      return;
    }
    try {
      setIsUpdatingProfile(true);

      let finalFile = file;
      const fileSizeInKB = file.size / 1024; // Convert bytes to KB

      if (fileSizeInKB > 500) {
        const options = {
          maxSizeMB: 0.5, // Maximum size in MB (500 KB)
          maxWidthOrHeight: 1400, // Max width/height to maintain aspect ratio
          useWebWorker: true, // Improves performance
        };
        finalFile = await imageCompression(file, options);
      }
      // Convert file (compressed or original) to base64 string
      const reader = new FileReader();
      reader.readAsDataURL(finalFile);
      reader.onload = async () => {
        const base64Image = reader.result;
        setSelectedImg(base64Image);
        await updateProfile({ profilePic: base64Image });
        fileInput.value = "";
        setSelectedImg(null);
      };
    } catch (error) {
      console.error("Error in image compression:", error);
    } finally {
      setIsUpdatingProfile(false);
    }
  };
  const displayDate = () => {
    const date = new Date(authUser.createdAt);
    return date.toLocaleDateString("en-GB").split("/").join("-");
  };

  return (
    <div className="container h-screen max-w-2xl pt-16 mx-auto sm:pt-20 bg-base-200 sm:bg-base-100">
      <div className="px-6 sm:rounded-lg bg-base-200">
        <div className="pt-8 pb-6 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>
          {/* Avtar Upload Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                className="object-cover border-4 rounded-full size-32"
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Ptofile"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }`}
              >
                <Camera className="size-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-600">
              {isUpdatingProfile
                ? "Setting up your new profile picture..."
                : "Want a fresh look? Tap the camera icon to update your photo"}
            </p>
          </div>

          {/* User Details */}
          <div className="p-6 bg-base-300 rounded-xl">
            <div className="space-y-6 ">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm ">
                  <User className="size-4" />
                  User name
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                  {authUser.fullName}
                </p>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="size-4" /> Email Address
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                  {authUser.email}
                </p>
              </div>
            </div>
          </div>
          {/* Extra Information */}
          <div className="p-6 mt-6 bg-base-300 rounded-xl">
            <h2 className="mb-4 text-lg font-medium">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{displayDate()}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-600">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
