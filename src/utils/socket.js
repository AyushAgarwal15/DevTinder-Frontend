import io from "socket.io-client";
import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
  // Get token from cookies
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const token = getCookie("token");

  if (!token) {
    console.error("No authentication token found for socket connection");
    // Return null or throw an error to handle this case in the component
    return null;
  }

  console.log("Creating socket connection with token");

  const socket = io(BASE_URL, {
    auth: {
      token: token,
    },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  });

  // Add event listeners for connection status
  socket.on("connect", () => {
    console.log("Socket connected successfully");
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error.message);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error.message);
  });

  return socket;
};
