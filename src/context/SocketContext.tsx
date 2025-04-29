import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import {
  createSocketConnection,
  ensureSocketConnected,
  resetSocketConnection,
} from "../utils/socket";
import { addNotification } from "../utils/messageNotificationsSlice";
import { RootState, AppDispatch, User } from "../utils/types";

interface MessageNotification {
  senderId: {
    _id: string;
    firstName?: string;
    lastName?: string;
    photoUrl?: string;
  };
  text: string;
  createdAt?: string;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

// Create context
const SocketContext = createContext<SocketContextType | null>(null);

// Custom hook to use socket context
export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const socketRef = useRef<Socket | null>(null);
  const user = useSelector((state: RootState) => state.user) as User | null;
  const dispatch = useDispatch<AppDispatch>();
  const [isConnected, setIsConnected] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    if (!user || !user._id) return;

    console.log("Setting up socket connection");
    socketRef.current = createSocketConnection();

    // Clean up on unmount or when user changes
    return () => {
      console.log("Cleaning up socket listeners in context");
    };
  }, [user]);

  // Set up message notification listeners
  useEffect(() => {
    if (!socketRef.current || !user) return;

    // Function to handle messageNotification event
    const handleMessageNotification = (message: MessageNotification) => {
      console.log("✉️ Notification received:", message);

      if (message.senderId && message.senderId._id !== user._id) {
        dispatch(
          addNotification({
            userId: message.senderId._id,
            name: message.senderId.firstName || "User",
            profilePic: message.senderId.photoUrl,
            lastMessage: message.text,
            timestamp: message.createdAt || new Date().toISOString(),
          })
        );
      }
    };

    // Listen for messageNotification events
    socketRef.current.on("messageNotification", handleMessageNotification);

    // Clean up listeners when component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.off("messageNotification", handleMessageNotification);
      }
    };
  }, [socketRef.current, user, dispatch]);

  // Periodic check to ensure socket is connected
  useEffect(() => {
    if (!user) return;

    const checkInterval = setInterval(() => {
      if (socketRef.current && !socketRef.current.connected) {
        console.log("Periodic check: Socket disconnected, reconnecting...");
        ensureSocketConnected();
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(checkInterval);
  }, [user]);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
