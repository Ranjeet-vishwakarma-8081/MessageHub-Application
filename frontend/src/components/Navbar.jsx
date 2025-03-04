import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import useChatStore from "../store/useChatStore";
import toast from "react-hot-toast";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const { selectedUser } = useChatStore();

  const showLogoutToast = () => {
    toast(
      (t) => (
        <div className="flex items-center justify-center gap-2 text-sm sm:text-base">
          <p className="sm:hidden">Please confirm your logout action.</p>
          <p className="hidden sm:block">Logging out? Please confirm.</p>
          <button
            className="px-2 py-1 bg-red-500 rounded hover:bg-red-600"
            onClick={() => {
              logout();
              toast.dismiss(t.id);
            }}
          >
            Logout
          </button>
        </div>
      ),
      {
        duration: 5000,
      }
    );
  };

  return (
    <header
      className={`fixed top-0 z-40 w-full border-b bg-base-100 border-base-300 backdrop-blur-lg bg-base-100/80 ${
        authUser && selectedUser && "hidden sm:block "
      }`}
    >
      <div className="container h-16 px-4 mx-auto">
        <div className="flex items-center justify-between h-full">
          {/* left side */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="items-center justify-center hidden rounded-lg sm:flex size-9 bg-primary/10">
                <MessageSquare className="size-5 text-primary" />
              </div>
              <h1 className="text-xl font-bold">MessageHub</h1>
            </Link>{" "}
          </div>

          {/* right side */}
          <div className="flex items-center gap-2">
            <Link
              to={"/settings"}
              className="gap-2 transition-colors btn btn-sm"
            >
              <Settings className="size-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className="gap-2 btn btn-sm">
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  className="flex items-center gap-2 text-red-600"
                  onClick={showLogoutToast}
                >
                  <LogOut className="size-5" />
                  <span className="hidden font-medium sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
