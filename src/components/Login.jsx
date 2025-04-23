import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { useToast } from "../context/ToastContext";
import ButtonLoader from "./ButtonLoader";

const Login = () => {
  const [emailId, setEmail] = useState("guestuser@gmail.com");
  const [password, setPassword] = useState("@Guest.1234");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

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

          <div className="flex gap-4">
            <button className="flex-1 py-2 px-4 border border-gray-700 rounded-lg text-gray-300 hover:bg-[#252b3d] transition-colors flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path>
              </svg>
              Google
            </button>
            <button className="flex-1 py-2 px-4 border border-gray-700 rounded-lg text-gray-300 hover:bg-[#252b3d] transition-colors flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 4.23 2.94 8.18 6.35 9.49v-2.52c-1.06.37-2.33.05-2.95-.88-.35-.52-.46-1.08-.89-1.49-.33-.31-.79-.65-.47-.67.71-.05 1.26.53 1.62.94.64.67 1.37.93 2.18.79.16-.56.43-1.09.85-1.46-.3-.08-2.69-.52-3.83-2.36-.65-1.06-.77-2.27-.42-3.47.33-.96 1.05-1.72 1.97-2.28v-.06c-.88-1.06-.44-3.21.9-3.55 1.38-1.11 3.77-.55 4.65.33 1.02-.24 2.2-.04 3.1.3.26-.66.93-1.23 1.56-1.23.87 1.14-.15 2.85-.71 3.25-.09 1.67-.47 2.91-1.28 3.79 0 .73.17 1.44.65 2.1 1.37 1.76 3.12 1.96 3.59 2.04-.46.56-.8 1.25-.89 2.06-.63.25-1.63.32-2.41-.35-.27-.24-.71-.72-.93-.45-.7.88 1.26 1.4 1.3 1.57.1.06 1.43 2.11.61 3.29 2.29-.31 3.62-1.53 4.61-3.33.28-.55.48-1.38.48-2.35 0-.91-.15-1.92-.15-2.34 0-.51.15-.97.66-1.29-2.05-.93-3.11-2.23-3.37-4.98 0 0-.09-.33-.22-.52-.48-.71-1.2-1.3-1.94-1.58.13-.21.26-.32.26-.32 0 0 .71.35 1.23.79.07-.9.24-2.15-.38-3.38 0 0 .05-.65.71-.62-.57-1.37-2.2-1.88-2.2-1.88s.5-.4 1.3-.36c-1.3-.91-3.25-1.35-4.58-1.35z"></path>
              </svg>
              GitHub
            </button>
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
