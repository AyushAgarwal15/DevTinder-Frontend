import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { useToast } from "../context/ToastContext";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("Failed to logout. Please try again.");
    }
  };

  // Check if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Close dropdown function
  const closeDropdown = () => {
    document.activeElement.blur();
  };

  return (
    <div className="sticky top-0 z-30 w-full bg-[#1c2030] border-b border-gray-800 shadow-md transition-all duration-200">
      <div className="navbar max-w-7xl mx-auto px-4">
        <div className="flex-1">
          <Link
            to="/"
            className="btn btn-ghost gap-2 normal-case text-xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:scale-105 transition-transform duration-200 cursor-pointer"
          >
            <span className="text-2xl">💘</span>
            DevTinder
          </Link>
        </div>

        {user && (
          <div className="hidden md:flex items-center gap-4 mr-6">
            <Link
              to="/connections"
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                isActive("/connections")
                  ? "bg-[#7C3AED]/10 text-[#7C3AED] font-medium"
                  : "text-gray-300 hover:bg-[#252b3d] hover:text-white"
              }`}
            >
              Connections
            </Link>
            <Link
              to="/requests"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center cursor-pointer ${
                isActive("/requests")
                  ? "bg-[#7C3AED]/10 text-[#7C3AED] font-medium"
                  : "text-gray-300 hover:bg-[#252b3d] hover:text-white"
              }`}
            >
              Requests
              {requests?.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-[#7C3AED] text-white rounded-full">
                  {requests?.length}
                </span>
              )}
            </Link>
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
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-400">Developer</p>
                </div>
                <div
                  tabIndex={0}
                  role="button"
                  className="w-10 h-10 rounded-full border-2 border-[#7C3AED] overflow-hidden hover:border-[#6D28D9] transition-all duration-300 cursor-pointer"
                >
                  <img
                    alt={`${user?.firstName}'s profile`}
                    src={user?.photoUrl || "https://via.placeholder.com/150"}
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                      <span className="ml-3">Requests</span>
                      {requests?.length > 0 && (
                        <span className="ml-1 px-1.5 py-0.5 text-xs bg-[#7C3AED] text-white rounded-full">
                          {requests?.length}
                        </span>
                      )}
                    </Link>
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
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
