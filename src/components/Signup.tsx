import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { useToast } from "../context/ToastContext";
import Logo from "./Logo";
import AuthThumbnail from "./AuthThumbnail";
import { RootState } from "../utils/types";
import {
  FaExclamationCircle,
  FaGithub,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

interface FormData {
  firstName: string;
  lastName: string;
  emailId: string;
  password: string;
  confirmPassword: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface PasswordRequirements {
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [passwordRequirements, setPasswordRequirements] =
    useState<PasswordRequirements>({
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSpecialChar: false,
    });
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
          console.log("User not authenticated, showing signup page");
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

  const validatePassword = (password: string) => {
    setPasswordRequirements({
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  // Update handleChange to include password validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      validatePassword(value);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all password requirements are met
    const allRequirementsMet = Object.values(passwordRequirements).every(
      (requirement) => requirement === true
    );

    if (!allRequirementsMet) {
      setError(
        "Please ensure your password meets all the security requirements below"
      );
      toast.error("Please check all password requirements");
      return;
    }

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("The passwords you entered don't match");
      toast.error("Passwords don't match");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const res = await axios.post(
        `${BASE_URL}/signup`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          emailId: formData.emailId,
          password: formData.password,
        },
        { withCredentials: true }
      );

      dispatch(addUser(res?.data));
      toast.success(
        "Welcome to DevTinder! Your account has been created successfully."
      );
      navigate("/profile");
    } catch (err: any) {
      let errorMessage =
        "Unable to create your account. Please try again later.";

      // Check for specific error cases
      if (
        err?.response?.data?.includes("E11000 duplicate key error") &&
        err?.response?.data?.includes("emailId")
      ) {
        errorMessage =
          "This email is already registered. Please use a different email or login to your existing account.";
      } else if (err?.response?.status === 400) {
        errorMessage = "Please fill in all required fields correctly.";
      } else if (err?.response?.data?.includes("buffering timed out after")) {
        errorMessage =
          "Server connection timed out. Please try again in a moment.";
      } else if (err?.response?.data) {
        // If we have a specific error message from the server, use it
        errorMessage = err.response.data;
      }

      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Signup error:", err?.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubSignup = () => {
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
          <div className="w-full max-w-xl bg-[#1c2030] shadow-2xl border border-gray-800 rounded-lg overflow-hidden mt-64">
            <div className="p-8">
              <div className="flex justify-center mb-8">
                <div className="scale-150 transform">
                  <Logo />
                </div>
              </div>
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-[#7C3AED]">
                  Join DevTinder
                </h2>
                <p className="text-gray-400 mt-2">
                  Connect with developers around the world
                </p>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Enter first name"
                      className="w-full px-4 py-3 bg-[#252b3d] border border-gray-700 rounded-lg text-gray-200 focus:border-[#7C3AED] focus:outline-none"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Enter last name"
                      className="w-full px-4 py-3 bg-[#252b3d] border border-gray-700 rounded-lg text-gray-200 focus:border-[#7C3AED] focus:outline-none"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="emailId"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-[#252b3d] border border-gray-700 rounded-lg text-gray-200 focus:border-[#7C3AED] focus:outline-none"
                    value={formData.emailId}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create a password"
                      className="w-full px-4 py-3 bg-[#252b3d] border border-gray-700 rounded-lg text-gray-200 focus:border-[#7C3AED] focus:outline-none"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    {formData.password !== "" && (
                      <button
                        type="button"
                        className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <FaEyeSlash size={18} />
                        ) : (
                          <FaEye size={18} />
                        )}
                      </button>
                    )}
                  </div>
                  <div className="mt-2 space-y-1 text-sm flex justify-between flex-wrap gap-2">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        {passwordRequirements.hasUpperCase ? (
                          <FaCheckCircle className="text-green-500" size={14} />
                        ) : (
                          <FaTimesCircle className="text-gray-400" size={14} />
                        )}
                        <span
                          className={`${
                            passwordRequirements.hasUpperCase
                              ? "text-green-500"
                              : "text-gray-400"
                          }`}
                        >
                          Uppercase letter
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {passwordRequirements.hasLowerCase ? (
                          <FaCheckCircle className="text-green-500" size={14} />
                        ) : (
                          <FaTimesCircle className="text-gray-400" size={14} />
                        )}
                        <span
                          className={`${
                            passwordRequirements.hasLowerCase
                              ? "text-green-500"
                              : "text-gray-400"
                          }`}
                        >
                          Lowercase letter
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        {passwordRequirements.hasNumber ? (
                          <FaCheckCircle className="text-green-500" size={14} />
                        ) : (
                          <FaTimesCircle className="text-gray-400" size={14} />
                        )}
                        <span
                          className={`${
                            passwordRequirements.hasNumber
                              ? "text-green-500"
                              : "text-gray-400"
                          }`}
                        >
                          Number
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {passwordRequirements.hasSpecialChar ? (
                          <FaCheckCircle className="text-green-500" size={14} />
                        ) : (
                          <FaTimesCircle className="text-gray-400" size={14} />
                        )}
                        <span
                          className={`${
                            passwordRequirements.hasSpecialChar
                              ? "text-green-500"
                              : "text-gray-400"
                          }`}
                        >
                          Special character
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      className="w-full px-4 py-3 bg-[#252b3d] border border-gray-700 rounded-lg text-gray-200 focus:border-[#7C3AED] focus:outline-none"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    {formData.confirmPassword !== "" && (
                      <button
                        type="button"
                        className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <FaEyeSlash size={18} />
                        ) : (
                          <FaEye size={18} />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg flex items-center">
                    <FaExclamationCircle className="h-5 w-5 mr-2" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className={`w-full py-3 rounded-lg font-bold text-white cursor-pointer ${
                    isLoading
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-[#7C3AED] hover:bg-[#6D28D9]"
                  } transition-colors mt-6`}
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              <div className="flex items-center my-4">
                <div className="flex-1 h-px bg-gray-700"></div>
                <div className="px-4 text-sm text-gray-500">OR</div>
                <div className="flex-1 h-px bg-gray-700"></div>
              </div>

              {/* GitHub Signup Button */}
              <div className="mb-4">
                <button
                  onClick={handleGitHubSignup}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors relative"
                >
                  <FaGithub className="text-xl" />
                  Sign up with GitHub
                  <span className="absolute -top-2 -right-2 bg-[#7C3AED] text-white text-xs px-2 py-1 rounded-full">
                    Recommended
                  </span>
                </button>
              </div>

              <p className="text-center mt-6 text-gray-400">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-[#7C3AED] cursor-pointer font-semibold"
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Right side: Image container (hidden on mobile) */}
        <AuthThumbnail />
      </div>
    </div>
  );
};

export default Signup;
