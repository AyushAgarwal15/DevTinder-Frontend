import io from "socket.io-client";
import { BASE_URL } from "./constants";

// Keep a single socket instance
let socketInstance = null;

export const createSocketConnection = () => {
  // If we already have a socket instance and it's connected, return it
  if (socketInstance && socketInstance.connected) {
    console.log("Reusing existing socket connection");
    return socketInstance;
  }

  // If we have an instance but it's disconnected, reconnect it
  if (socketInstance) {
    console.log("Reconnecting existing socket");
    socketInstance.connect();
    return socketInstance;
  }

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
    return null;
  }

  console.log("Creating new socket connection");

  // Create a new socket connection with basic options
  socketInstance = io(BASE_URL, {
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    timeout: 20000,
  });

  // Log connection events
  socketInstance.on("connect", () => {
    console.log("Socket connected successfully!");
  });

  socketInstance.on("connect_error", (error) => {
    console.error("Socket connection error:", error.message);
  });

  socketInstance.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  return socketInstance;
};

// Reset socket connection (for logout)
export const resetSocketConnection = () => {
  if (socketInstance) {
    console.log("Resetting socket connection");
    socketInstance.disconnect();
    socketInstance = null;
  }
};

// Function to ensure socket is connected
export const ensureSocketConnected = () => {
  if (socketInstance && !socketInstance.connected) {
    console.log("Ensuring socket is connected");
    socketInstance.connect();
  }
  return socketInstance;
};
