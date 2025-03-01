import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

import useChatStore from "../store/useChatStore";
import { Navigate } from "react-router-dom";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const isInnerWidthSm = window.innerWidth < 640;

  return (
    <div className="w-full sm:h-screen bg-base-200">
      <div
        className={`flex items-center justify-center sm:pt-20 md:px-4 ${
          !selectedUser && "pt-16"
        }`}
      >
        <div
          className={`bg-base-100 sm:rounded-lg shadow-lg w-full max-w-96 md:max-w-5xl lg:max-w-7xl sm:h-[calc(100dvh-8rem)] ${
            !selectedUser && "h-[calc(100dvh-4rem)]"
          }`}
        >
          <div className="flex h-full overflow-hidden rounded-lg">
            <Sidebar />
            {!selectedUser ? (
              <NoChatSelected /> // This is the default Placeholder for the user
            ) : !isInnerWidthSm ? (
              <ChatContainer />
            ) : (
              <Navigate to="/chat-container" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
