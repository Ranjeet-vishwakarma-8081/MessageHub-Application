import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="flex-col items-center justify-center flex-1 hidden w-full p-16 md:flex bg-base-100/50">
      <div className="max-w-md space-y-6 text-center">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div className="flex items-center justify-center size-16 rounded-2xl bg-primary/10 animate-bounce">
              <MessageSquare className="size-8 text-primary" />
            </div>
          </div>
        </div>
        {/* Welcome Text */}
        <h2 className="text-2xl font-bold"> Welcome to MessageHub!</h2>
        <p className="text-base-content/60">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
