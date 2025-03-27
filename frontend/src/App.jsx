import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import useAuthStore from "./store/useAuthStore";
import useThemeStore from "./store/useThemeStore";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import CapturePhoto from "./components/CapturePhoto";
import useChatStore from "./store/useChatStore";
import MobileChatContainer from "./pages/MobileChatContainer";

const App = () => {
  const location = useLocation();
  const {
    authUser,
    // message,
    checkAuth,
    isCheckingAuth,
    // onlineUsers
  } = useAuthStore();
  const { theme } = useThemeStore();
  const { selectedUser, setSelectedUser } = useChatStore();
  // console.log({ onlineUsers });

  // Reset selectedUser, when navigating back to home page
  useEffect(() => {
    if (location.pathname === "/") setSelectedUser(null);
  }, [location.pathname, setSelectedUser]);

  // When app loads, It checks if the current user is authenticated or not.
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // if (!authUser) {
  //   console.log(message);
  // } else {
  //   console.log("AuthUser:", authUser.fullName, "has", message);
  // }
  // If checkingAuth, display a loading spinner.
  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-15 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme} className="select-none">
      {/* Toast library Implementation */}
      {/* <Toaster /> */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            zIndex: 9999, // Ensure it's above other elements
            background: "#333",
            color: "#fff",
          },
        }}
      />
      <Navbar />
      <Routes>
        <Route
          exact
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          exact
          path="/chat-container"
          element={
            authUser && selectedUser ? (
              <MobileChatContainer />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          exact
          path="/chat-container/capture-photo"
          element={
            authUser && selectedUser ? (
              <CapturePhoto />
            ) : (
              <Navigate to={"/chat-container"} />
            )
          }
        />
        <Route
          exact
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          exact
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route exact path="/settings" element={<SettingsPage />} />
        <Route
          exact
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="*"
          element={
            authUser ? <Navigate to={"/"} /> : <Navigate to={"/login"} />
          }
        ></Route>
      </Routes>
    </div>
  );
};

export default App;
