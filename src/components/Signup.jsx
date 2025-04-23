import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { useToast } from "../context/ToastContext";

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1c2030] to-[#16171f] p-4">
      <div className="w-full max-w-md bg-[#1c2030] shadow-2xl border border-gray-800 rounded-lg overflow-hidden">
        <div className="p-8">
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
              className={`w-full py-3 rounded-lg font-bold text-white ${
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
  );
};

export default Signup;
