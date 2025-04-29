import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { removeRequests } from "../utils/requestSlice";
import { removeConnections } from "../utils/connectionSlice";
import { removeFeed } from "../utils/feedSlice";
import { removeAllNotifications } from "../utils/messageNotificationsSlice";
import { resetSocketConnection } from "../utils/socket";
import { useToast } from "../context/ToastContext";
import Logo from "./Logo";
import Messages from "./Messages";
import { RootState } from "../utils/types";
import { BsChatDots } from "react-icons/bs";
import { FaSignOutAlt, FaUser, FaUsers, FaUserPlus } from "react-icons/fa";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  email?: string;
}

interface Request {
  _id: string;
  fromUserId: any;
  toUserId: string;
}

const NavBar: React.FC = () => {
  const user = useSelector((store: RootState) => store.user) as User | null;
  const requests = useSelector((store: RootState) => store.requests) as
    | Request[]
    | null;
  const { unreadCount } = useSelector(
    (store: RootState) => store.messageNotifications
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();

  const handleLogout = async (): Promise<void> => {
    try {
      // Reset socket connection first
      resetSocketConnection();

      // Then, make the API request and clear the Redux store
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
      dispatch(removeUser());
      dispatch(removeRequests(null));
      dispatch(removeConnections());
      dispatch(removeFeed());
      dispatch(removeAllNotifications());

      // Finally, navigate to login page after Redux store is cleared
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to logout. Please try again.");
    }
  };

  // Check if a path is active
  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  // Close dropdown function
  const closeDropdown = (): void => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  return (
    <div className="sticky top-0 z-30 w-full bg-[#1c2030] border-b border-gray-800 shadow-md transition-all duration-200">
      <div className="navbar max-w-7xl mx-auto px-4">
        <Logo />

        {user && (
          <div className="hidden md:flex items-center gap-4 mr-6">
            <Link
              to="/connections"
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center ${
                isActive("/connections")
                  ? "bg-[#7C3AED]/10 text-[#7C3AED] font-medium"
                  : "text-gray-300 hover:bg-[#252b3d] hover:text-white"
              }`}
            >
              <div className="relative">
                <FaUsers className="h-5 w-5" />
              </div>
              <span className="ml-1">Connections</span>
            </Link>
            <Link
              to="/requests"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center cursor-pointer ${
                isActive("/requests")
                  ? "bg-[#7C3AED]/10 text-[#7C3AED] font-medium"
                  : "text-gray-300 hover:bg-[#252b3d] hover:text-white"
              }`}
            >
              <div className="relative">
                <FaUserPlus className="h-5 w-5" />
              </div>
              <span className="ml-1">Requests</span>
              {requests && requests.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-[#7C3AED] text-white rounded-full">
                  {requests.length}
                </span>
              )}
            </Link>

            {/* Messages dropdown */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className={`flex items-center px-3 py-2 rounded-lg transition-colors cursor-pointer ${"text-gray-300 hover:bg-[#252b3d] hover:text-white"}`}
              >
                <div className="relative">
                  <BsChatDots className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs bg-[#7C3AED] text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </div>
                <span className="ml-1">Messages</span>
              </div>
              <div
                tabIndex={0}
                className="dropdown-content z-30 mt-2 shadow-2xl bg-[#1c2030] border border-gray-800 rounded-lg w-80"
              >
                <Messages />
              </div>
            </div>
          </div>
        )}

        {!user && (
          <div className="flex gap-2">
            <Link
              to="/login"
              className="px-3 py-1.5 text-sm text-gray-300 hover:text-white cursor-pointer"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="px-3 py-1.5 text-sm bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg transition-colors cursor-pointer"
            >
              Sign up
            </Link>
          </div>
        )}

        {user && (
          <div className="flex items-center gap-4">
            <div className="dropdown dropdown-end">
              <div className="flex items-center gap-3">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-semibold text-gray-200">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-400">Developer</p>
                </div>
                <div
                  tabIndex={0}
                  role="button"
                  className="w-10 h-10 rounded-full border-2 border-[#7C3AED] overflow-hidden hover:border-[#6D28D9] transition-all duration-300 cursor-pointer"
                >
                  <img
                    alt={`${user.firstName}'s profile`}
                    src={user.photoUrl || "https://via.placeholder.com/150"}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <ul
                tabIndex={0}
                className="dropdown-content z-30 mt-4 w-60 p-3 shadow-2xl bg-[#1c2030] border border-gray-800 rounded-lg"
              >
                <li className="mb-1">
                  <span className="text-xs font-semibold uppercase text-gray-500">
                    Account
                  </span>
                </li>
                <li>
                  <Link
                    to="/profile"
                    onClick={closeDropdown}
                    className={`flex items-center p-3 rounded-lg cursor-pointer ${
                      isActive("/profile")
                        ? "bg-[#7C3AED]/10 text-[#7C3AED] font-medium"
                        : "text-gray-300 hover:bg-[#252b3d] hover:text-white"
                    }`}
                  >
                    <FaUser className="h-5 w-5" />
                    <span className="ml-3">Profile</span>
                  </Link>
                </li>

                {/* Mobile only menu items */}
                <div className="md:hidden">
                  <li>
                    <Link
                      to="/connections"
                      onClick={closeDropdown}
                      className={`flex items-center p-3 rounded-lg cursor-pointer ${
                        isActive("/connections")
                          ? "bg-[#7C3AED]/10 text-[#7C3AED] font-medium"
                          : "text-gray-300 hover:bg-[#252b3d] hover:text-white"
                      }`}
                    >
                      <FaUsers className="h-5 w-5" />
                      <span className="ml-3">Connections</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/requests"
                      onClick={closeDropdown}
                      className={`flex items-center p-3 rounded-lg cursor-pointer ${
                        isActive("/requests")
                          ? "bg-[#7C3AED]/10 text-[#7C3AED] font-medium"
                          : "text-gray-300 hover:bg-[#252b3d] hover:text-white"
                      }`}
                    >
                      <FaUserPlus className="h-5 w-5" />
                      <span className="ml-3">Requests</span>
                      {requests && requests.length > 0 && (
                        <span className="ml-1 px-1.5 py-0.5 text-xs bg-[#7C3AED] text-white rounded-full">
                          {requests.length}
                        </span>
                      )}
                    </Link>
                  </li>

                  {/* Mobile Messages Link */}
                  <li>
                    <div className="dropdown dropdown-bottom dropdown-end w-full">
                      <div
                        className="flex items-center p-3 rounded-lg cursor-pointer text-gray-300 hover:bg-[#252b3d] hover:text-white w-full"
                        tabIndex={0}
                        role="button"
                      >
                        <BsChatDots className="h-5 w-5" />
                        <span className="ml-3">Messages</span>
                        {unreadCount > 0 && (
                          <span className="ml-auto px-1.5 py-0.5 text-xs bg-[#7C3AED] text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </span>
                        )}
                      </div>
                      <div
                        tabIndex={0}
                        className="dropdown-content z-30 mt-2 shadow-2xl bg-[#1c2030] border border-gray-800 rounded-lg w-full max-w-sm"
                      >
                        <Messages />
                      </div>
                    </div>
                  </li>
                </div>

                <div className="h-px bg-gray-800 my-2"></div>
                <li>
                  <button
                    onClick={() => {
                      closeDropdown();
                      handleLogout();
                    }}
                    className="flex p-3 text-red-400 hover:bg-red-900/20 w-full rounded-lg cursor-pointer"
                  >
                    <FaSignOutAlt className="h-5 w-5" />
                    <span className="ml-3">Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
