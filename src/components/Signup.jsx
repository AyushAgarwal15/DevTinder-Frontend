import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { useToast } from "../context/ToastContext";
import Logo from "./Logo";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const user = useSelector((store) => store.user);

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsCheckingAuth(true);
        // First check Redux store
        if (user) {
          navigate("/");
          return;
        }

        // Then verify with the server
        const res = await axios.get(BASE_URL + "/profile/view", {
          withCredentials: true,
        });

        if (res.data) {
          // User is authenticated, update Redux and redirect
          dispatch(addUser(res.data));
          navigate("/");
        }
      } catch (error) {
        // If 401 or any other error, user is not authenticated, allow signup page access
        console.log("User not authenticated, showing signup page");
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, [dispatch, navigate, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const res = await axios.post(
        BASE_URL + "/signup",
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          emailId: formData.emailId,
          password: formData.password,
        },
        { withCredentials: true }
      );

      dispatch(addUser(res?.data));
      toast.success("Signup successful! Welcome to DevTinder!");
      navigate("/profile");
    } catch (err) {
      const errorMessage = err?.response?.data || "Something went wrong";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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
          <div className="w-full max-w-xl bg-[#1c2030] shadow-2xl border border-gray-800 rounded-lg overflow-hidden mt-40">
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
                  <input
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    className="w-full px-4 py-3 bg-[#252b3d] border border-gray-700 rounded-lg text-gray-200 focus:border-[#7C3AED] focus:outline-none"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    className="w-full px-4 py-3 bg-[#252b3d] border border-gray-700 rounded-lg text-gray-200 focus:border-[#7C3AED] focus:outline-none"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
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
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          <img
            src="/auth_thumbnail.jpeg"
            alt="Developer coding"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1c2030]/40 to-[#7C3AED]/30">
            <div className="absolute bottom-10 left-10 max-w-md">
              <h2 className="text-4xl font-bold mb-3 text-white drop-shadow-lg">
                Connect with developers worldwide
              </h2>
              <p className="text-white text-xl drop-shadow-md">
                Find your perfect coding partner on DevTinder
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
