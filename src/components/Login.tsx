import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { useToast } from "../context/ToastContext";
import ButtonLoader from "./ButtonLoader";
import { addRequests } from "../utils/requestSlice";
import Logo from "./Logo";
import authThumbnail from "../assets/images/auth_thumbnail.jpeg";
import { RootState } from "../utils/types";
import { FaExclamationCircle, FaGithub } from "react-icons/fa";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

const Login: React.FC = () => {
  const [emailId, setEmail] = useState<string>("guestuser@gmail.com");
  const [password, setPassword] = useState<string>("@Guest.1234");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const user = useSelector((store: RootState) => store.user) as User | null;

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuthStatus = async () => {
      // Create an abort controller for the API request
      const controller = new AbortController();

      // Set a timeout to abort the request after 5 seconds
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.log("Auth check timed out");
        setIsCheckingAuth(false);
        sessionStorage.setItem("lastAuthCheck", Date.now().toString());
      }, 5000);

      try {
        setIsCheckingAuth(true);

        // First check Redux store
        if (user) {
          clearTimeout(timeoutId);
          navigate("/");
          return;
        }

        // Check if we've already verified auth status recently
        const lastAuthCheck = sessionStorage.getItem("lastAuthCheck");
        const authCheckTimestamp = lastAuthCheck ? parseInt(lastAuthCheck) : 0;
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;

        // Skip API call if we checked auth in the last 5 minutes and user is not authenticated
        if (authCheckTimestamp > fiveMinutesAgo) {
          clearTimeout(timeoutId);
          setIsCheckingAuth(false);
          return;
        }

        // Then verify with the server
        const res = await axios.get(`${BASE_URL}/profile/view`, {
          withCredentials: true,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (res.data) {
          // User is authenticated, update Redux and redirect
          dispatch(addUser(res.data));
          navigate("/");
        }
      } catch (error) {
        clearTimeout(timeoutId);

        // If aborted or 401 or any other error, user is not authenticated
        if (error instanceof DOMException && error.name === "AbortError") {
          console.log("Auth check aborted due to timeout");
        } else {
          console.log("User not authenticated, showing login page");
        }

        // Record the timestamp of this auth check
        sessionStorage.setItem("lastAuthCheck", Date.now().toString());
      } finally {
        clearTimeout(timeoutId);
        setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, [dispatch, navigate, user]);

  const fetchRequests = async (): Promise<void> => {
    try {
      const res = await axios.get(`${BASE_URL}/user/requests/received`, {
        withCredentials: true,
      });
      dispatch(addRequests(res?.data?.data));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError("");

      const res = await axios.post(
        `${BASE_URL}/login`,
        {
          emailId,
          password,
        },
        { withCredentials: true }
      );

      dispatch(addUser(res.data));
      toast.success("Login successful! Welcome back.");
      // Fetching requests after successful login so that I can show the request count on entering in the app
      fetchRequests();
      navigate("/");
    } catch (err: any) {
      const errorMessage = err?.response?.data || "Something went wrong";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubLogin = () => {
    window.location.href = `${BASE_URL}/auth/github`;
  };

  // Return a loading state while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1c2030] to-[#16171f]">
        <div className="w-16 h-16 border-4 border-t-transparent border-[#7C3AED] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1c2030] to-[#16171f]">
      <div className="flex w-full h-screen overflow-hidden">
        {/* Left side: Form container */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 overflow-y-auto scrollbar-hide">
          <div className="w-full max-w-xl bg-[#1c2030] shadow-2xl border border-gray-800 rounded-lg overflow-hidden">
            <div className="p-8">
              <div className="flex justify-center mb-8">
                <div className="scale-150 transform">
                  <Logo />
                </div>
              </div>
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-[#7C3AED]">
                  Welcome Back
                </h2>
                <p className="text-gray-400 mt-2">
                  Sign in to continue to DevTinder
                </p>
              </div>

              {/* GitHub Login Button */}
              <div className="mb-4">
                <button
                  onClick={handleGitHubLogin}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                >
                  <FaGithub className="text-xl" />
                  Sign in with GitHub
                </button>
              </div>

              <div className="flex items-center my-4">
                <div className="flex-1 h-px bg-gray-700"></div>
                <div className="px-4 text-sm text-gray-500">OR</div>
                <div className="flex-1 h-px bg-gray-700"></div>
              </div>

              <div className="w-full mb-4">
                <label className="block text-gray-300 font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-[#252b3d] border border-gray-700 rounded-lg text-gray-200 focus:border-[#7C3AED] focus:outline-none"
                  value={emailId}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="w-full mb-6">
                <label className="block text-gray-300 font-semibold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-[#252b3d] border border-gray-700 rounded-lg text-gray-200 focus:border-[#7C3AED] focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="flex justify-end mt-2">
                  <span className="text-sm text-gray-400 hover:text-[#7C3AED] cursor-pointer transition-colors">
                    Forgot password?
                  </span>
                </div>
              </div>

              {error && (
                <div className="mb-4 flex items-center gap-2 text-red-400 bg-red-900/20 p-3 rounded-lg">
                  <FaExclamationCircle />
                  <span>{error}</span>
                </div>
              )}

              <button
                className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? <ButtonLoader text="Signing in..." /> : "Sign In"}
              </button>

              <p className="text-center text-gray-400 mt-6">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-[#7C3AED] hover:underline font-medium"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right side: Image */}
        <div className="hidden lg:block lg:w-1/2 bg-cover bg-center">
          <img
            src={authThumbnail}
            alt="Developers connecting"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
