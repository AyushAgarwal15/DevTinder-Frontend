// Get the current environment
const isDevelopment = import.meta.env.MODE === "development";

// API URL configuration
export const BASE_URL = isDevelopment
  ? "http://localhost:7777"
  : import.meta.env.VITE_API_BASE_URL ||
    "https://devtinder-backend.vercel.app/";

// Cookie configuration
export const COOKIE_OPTIONS = {
  path: "/",
  secure: !isDevelopment,
  sameSite: isDevelopment ? "lax" : "none",
} as const;

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${BASE_URL}/login`,
  SIGNUP: `${BASE_URL}/signup`,
  LOGOUT: `${BASE_URL}/logout`,
  PROFILE: `${BASE_URL}/profile/view`,
} as const;
