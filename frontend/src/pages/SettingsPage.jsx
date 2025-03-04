import { THEMES } from "../constants";
import useThemeStore from "../store/useThemeStore";
import { Image, Send } from "lucide-react";

const PREVIEW_MESSAGES = [
  {
    id: 1,
    content: "Hey! How's it going?",
    isSent: false,
  },
  {
    id: 2,
    content: "I'm going great! Just working on some new features.",
    isSent: true,
  },
  // {
  //   type: "sent",
  //   message: "Hey, how's it going?",
  // },
  // {
  //   type: "received",
  //   message: "Hi! I'm doing well. How about you?",
  // },
  // {
  //   type: "sent",
  //   message: "I'm feeling great too. Did you sleep well?",
  // },
  // {
  //   type: "received",
  //   message: "Yes, I slept well. Did you hear about the new iPhone 15?",
  // },
  // {
  //   type: "sent",
  //   message: "Yeah, it's fascinating! I've been waiting for it.",
  // },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="container h-screen max-w-5xl pt-16 mx-auto md:pt-20 ">
      <div className="px-6 rounded-lg bg-base-200">
        <div className="pt-8 pb-6 space-y-6 ">
          <div className="flex flex-col gap-1 ">
            <h2 className="text-2xl font-semibold">Theme</h2>
            <p className="text-sm text-base-content/70">
              Choose a brand new theme for your chat interface
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 md:grid-cols-8">
            {THEMES.map((t) => (
              <button
                type="button"
                key={t}
                className={`group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors ${
                  theme === t ? "bg-base-200" : "hover:bg-base-200/50"
                }`}
                onClick={() => setTheme(t)}
              >
                <div
                  className="relative w-full h-8 overflow-hidden rounded-md"
                  data-theme={t}
                >
                  <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                    <div className="rounded bg-primary"></div>
                    <div className="rounded bg-secondary"></div>
                    <div className="rounded bg-accent"></div>
                    <div className="rounded bg-neutral"></div>
                  </div>
                </div>
                <span className="text-[11px] font-medium truncate w-full text-center">
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </span>
              </button>
            ))}
          </div>
          {/* Preview Section */}
          <h3 className="mb-3 text-xl font-semibold">Preview</h3>
          <div className="overflow-hidden border shadow-lg rounded-xl border-base-300 bg-base-300">
            <div className="p-3 ">
              <div className="max-w-lg mx-auto">
                {/* Mock Chat UI */}
                <div className="overflow-hidden shadow-sm bg-base-100 rounded-xl">
                  {/* Chat Header */}
                  <div className="p-3 border-b border-base-300 bg-base-100">
                    <div className="flex items-center gap-3">
                      {/* <div className="flex items-center justify-center w-8 h-8 font-medium rounded-full bg-primary text-primary-content">
                        R
                      </div> */}
                      <div>
                        <img
                          className="object-cover rounded-full size-8"
                          src="/Ranjeet_profile_photo.jpg"
                          alt="Ranjeet profile"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">
                          Ranjeet Vishwakarma
                        </h3>
                        <p className="text-xs text-green-600">Online</p>
                      </div>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="p-4 space-y-4 min-h-[180px] max-h-fit overflow-y-auto bg-base-100">
                    {PREVIEW_MESSAGES.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.isSent ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`
                          max-w-[80%] rounded-xl p-3 shadow-sm
                          ${
                            message.isSent
                              ? "bg-primary text-primary-content"
                              : "bg-base-300"
                          }
                        `}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`
                            text-[10px] mt-1.5
                            ${
                              message.isSent
                                ? "text-primary-content/70"
                                : "text-base-content/70"
                            }
                          `}
                          >
                            12:00 PM
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div className="p-3 border-t border-base-300 bg-base-100">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        className="flex-1 w-full rounded-full input input-bordered input-md focus:outline-none"
                        placeholder="This is a preview"
                        readOnly
                        name="preview_input"
                      />
                      <button
                        type="button"
                        className={`flex btn btn-circle text-orange-700 bg-base-300`}
                      >
                        <Image className="size-5" />
                      </button>
                      <button className=" btn-circle btn btn-primary">
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
