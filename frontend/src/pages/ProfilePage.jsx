import { useState } from "react";
import useAuthStore from "../store/useAuthStore.js";
import { Camera, User, Mail } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.log("User has cancelled to upload image");
      return;
    }
    // setSelectedImg(URL.createObjectURL(file));
    const reader = new FileReader(); // so that we can use the image file as a string and we call it as base64 string
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="container h-screen max-w-2xl pt-16 mx-auto sm:pt-20 bg-base-200 sm:bg-base-100">
      <div className="px-6 sm:rounded-lg bg-base-200">
        <div className="space-y-6 pt-8 pb-6">
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
                ? "Updating your profile picture..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* User Details */}
          <div className="p-6 bg-base-300 rounded-xl">
            <div className="space-y-6 ">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <User className="size-4" />
                  Full Name
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                  {authUser.fullName}
                </p>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-zinc-600">
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
                <span>{authUser.createdAt.split("T")[0]}</span>
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
