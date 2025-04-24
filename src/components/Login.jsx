import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { useToast } from "../context/ToastContext";
import ButtonLoader from "./ButtonLoader";
import { addRequests } from "../utils/requestSlice";

const Login = () => {
  const [emailId, setEmail] = useState("guestuser@gmail.com");
  const [password, setPassword] = useState("@Guest.1234");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res?.data?.data));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError("");

      const res = await axios.post(
        BASE_URL + "/login",
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
            <h2 className="text-3xl font-bold text-[#7C3AED]">Welcome Back</h2>
            <p className="text-gray-400 mt-2">
              Sign in to continue to DevTinder
            </p>
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
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 flex items-center">
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
            className={`w-full py-3 rounded-lg font-bold text-white cursor-pointer ${
              isLoading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-[#7C3AED] hover:bg-[#6D28D9]"
            } transition-colors`}
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? <ButtonLoader text="Signing in..." /> : "Sign In"}
          </button>

          <div className="relative flex items-center gap-3 my-6">
            <div className="flex-grow h-px bg-gray-700"></div>
            <span className="text-gray-500 text-sm">OR</span>
            <div className="flex-grow h-px bg-gray-700"></div>
          </div>

          <p className="text-center mt-6 text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[#7C3AED] cursor-pointer font-semibold"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
