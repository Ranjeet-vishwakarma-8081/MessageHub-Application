import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import PropTypes from "prop-types";

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

const pageVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: 50, transition: { duration: 0.5 } },
};

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
    <div data-theme={theme} className="overflow-x-hidden select-none">
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
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            exact
            path="/"
            element={
              authUser ? (
                <PageWrapper>
                  <HomePage />
                </PageWrapper>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            exact
            path="/chat-container"
            element={
              authUser && selectedUser ? (
                <PageWrapper>
                  <MobileChatContainer />
                </PageWrapper>
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
            element={
              !authUser ? (
                <PageWrapper>
                  <SignUpPage />
                </PageWrapper>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            exact
            path="/login"
            element={
              !authUser ? (
                <PageWrapper>
                  <LoginPage />
                </PageWrapper>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            exact
            path="/settings"
            element={
              <PageWrapper>
                <SettingsPage />
              </PageWrapper>
            }
          />
          <Route
            exact
            path="/profile"
            element={
              authUser ? (
                <PageWrapper>
                  <ProfilePage />
                </PageWrapper>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="*"
            element={
              authUser ? <Navigate to={"/"} /> : <Navigate to={"/login"} />
            }
          ></Route>
        </Routes>
      </AnimatePresence>
    </div>
  );
};

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      className="overflow-x-hidden"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
};

PageWrapper.propTypes = {
  children: PropTypes.node.isRequired, // Ensures children is a valid React node
};
export default App;
