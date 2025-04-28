import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { createSocketConnection } from "../utils/socket";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { markAsRead } from "../utils/messageNotificationsSlice";

// Default avatar for fallback instead of external placeholder
const DEFAULT_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666666'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

const Chat = () => {
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [chatData, setChatData] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [targetUser, setTargetUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const hasInitializedRef = useRef(false);
  const dispatch = useDispatch();

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mark messages from this user as read when entering the chat
  useEffect(() => {
    if (targetUserId) {
      dispatch(markAsRead(targetUserId));
    }
  }, [targetUserId, dispatch]);

  // Notify server when navigating away from chat
  useEffect(() => {
    return () => {
      // When component unmounts (leaving chat)
      if (socketRef.current && userId && targetUserId) {
        console.log("Leaving chat with", targetUserId);
        socketRef.current.emit("leaveChat", {
          userId,
          targetUserId,
        });
      }
    };
  }, [userId, targetUserId]);

  const fetchChats = async () => {
    try {
      const response = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });

      // Store the whole chat data
      setChatData(response.data);

      // Extract messages from the response
      if (response.data && Array.isArray(response.data.messages)) {
        setMessages(response.data.messages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [targetUserId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    socketRef?.current?.emit("sendMessage", {
      firstName: user?.firstName,
      userId,
      targetUserId,
      text: newMessage,
    });

    // Add message to UI immediately (optimistic update)
    // Format matches the expected structure from API
    const newMsg = {
      senderId: {
        _id: userId,
        firstName: user?.firstName,
        lastName: user?.lastName,
        photoUrl: user?.photoUrl,
        age: user?.age,
      },
      text: newMessage,
      _id: Date.now().toString(), // Temporary ID until server response
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);

    // Clear input after sending
    setNewMessage("");
  };

  // Separate useEffect for fetching target user data
  useEffect(() => {
    async function loadTargetUser() {
      if (!targetUserId) return;

      try {
        setLoading(true);
        const res = await axios.get(
          `${BASE_URL}/profile/view/${targetUserId}`,
          {
            withCredentials: true,
          }
        );
        console.log("Target user data:", res.data);
        setTargetUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user details:", err);
      } finally {
        setLoading(false);
      }
    }

    loadTargetUser();
  }, [targetUserId]);

  // Separate useEffect for socket connection
  useEffect(() => {
    if (!userId || !targetUserId || hasInitializedRef.current) return;

    console.log(
      "Initializing socket connection in Chat for room:",
      targetUserId
    );
    hasInitializedRef.current = true;

    // Create socket connection once - will reuse existing connection if available
    socketRef.current = createSocketConnection();

    // Check if connection was created successfully
    if (!socketRef.current) {
      console.error("Failed to create socket connection");
      return;
    }

    // Clean up any previous listeners to avoid duplicates
    socketRef.current.off("receivedMessage");
    socketRef.current.off("chatHistory");
    socketRef.current.off("error");
    socketRef.current.off("userJoined");

    // Listen for errors
    socketRef.current.on("error", (error) => {
      console.error("Socket error in Chat:", error);
      // Optionally show an error message to the user
    });

    // Join chat room
    console.log("Emitting joinChat event for:", targetUserId);
    socketRef.current.emit("joinChat", {
      firstName: user?.firstName,
      userId,
      targetUserId,
    });

    // Listen for incoming messages
    socketRef.current.on("receivedMessage", (message) => {
      console.log("Received message in Chat component:", message);

      // Only add the received message if it's not already added via optimistic update
      if (message.senderId && message.senderId._id !== userId) {
        setMessages((prev) => {
          // Check if this message is already in our list to avoid duplicates
          const isDuplicate = prev.some(
            (m) =>
              m._id === message._id ||
              (m.text === message.text &&
                m.senderId &&
                m.senderId._id === message.senderId._id)
          );

          if (isDuplicate) {
            console.log("Skipping duplicate message");
            return prev;
          }

          return [...prev, message];
        });

        // Since we're actively in this chat, mark messages from this user as read
        dispatch(markAsRead(targetUserId));
      } else if (message.senderId && message.senderId._id === userId) {
        // For messages sent by us, find our optimistic update and replace it with the server version
        // This ensures we have the correct server ID and timestamp
        setMessages((prev) => {
          const existingIndex = prev.findIndex(
            (m) => m.text === message.text && m.senderId._id === userId
          );

          if (existingIndex !== -1) {
            const updated = [...prev];
            updated[existingIndex] = message;
            return updated;
          }

          // If not found (unlikely but possible), just append
          return [...prev, message];
        });
      }
    });

    // Listen for chat history
    socketRef.current.on("chatHistory", (history) => {
      console.log("Received chat history:", history);
      if (Array.isArray(history) && history.length > 0) {
        setMessages(history);
      }
    });

    // Monitor connection status
    const handleReconnect = () => {
      console.log("Socket reconnected in Chat component, rejoining chat");
      // Rejoin the chat room on reconnection
      socketRef.current.emit("joinChat", {
        firstName: user?.firstName,
        userId,
        targetUserId,
      });
    };

    socketRef.current.on("connect", handleReconnect);

    // Clean up on unmount
    return () => {
      console.log("Cleaning up socket connection in Chat");
      if (socketRef.current) {
        socketRef.current.off("receivedMessage");
        socketRef.current.off("chatHistory");
        socketRef.current.off("error");
        socketRef.current.off("userJoined");
        socketRef.current.off("connect", handleReconnect);
        // Note: We don't disconnect the socket anymore since it's shared
        // We just remove our listeners
      }
      hasInitializedRef.current = false;
    };
  }, [userId, targetUserId, dispatch, user?.firstName]);

  // Determine if we have target user information
  const hasTargetUserInfo = targetUser && targetUser.firstName;

  return (
    <div className="h-screen w-full flex items-stretch overflow-hidden bg-gradient-to-br from-[#1c2030] to-[#16171f]">
      <motion.div
        className="w-full h-full flex flex-col bg-[#1c2030] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Chat header */}
        <div className="p-4 bg-[#252b3d] border-b border-gray-800 flex items-center">
          <Link
            to="/connections"
            className="text-gray-400 hover:text-[#7C3AED] transition-colors mr-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Link>

          {/* Target user info - show placeholder while loading */}
          <div className="flex items-center ml-2 flex-1">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#7C3AED] shadow-lg shadow-purple-500/20">
              {loading ? (
                <div className="w-full h-full bg-gray-700 animate-pulse"></div>
              ) : (
                <img
                  src={targetUser?.photoUrl || DEFAULT_AVATAR}
                  alt="Profile avatar"
                  className="w-full h-full object-cover bg-gray-700"
                  onError={(e) => {
                    if (e.target.src !== DEFAULT_AVATAR) {
                      e.target.src = DEFAULT_AVATAR;
                    }
                  }}
                />
              )}
            </div>
            <div className="ml-3">
              {loading ? (
                <>
                  <div className="h-5 w-24 bg-gray-700 rounded animate-pulse mb-1"></div>
                  <div className="h-3 w-16 bg-gray-700 rounded animate-pulse"></div>
                </>
              ) : hasTargetUserInfo ? (
                <>
                  <p className="text-white font-medium text-lg">
                    {targetUser.firstName} {targetUser.lastName || ""}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {targetUser.age && `${targetUser.age} years`}
                    {targetUser.gender && targetUser.age && " • "}
                    {targetUser.gender}
                  </p>
                </>
              ) : (
                <p className="text-white font-medium">Loading user...</p>
              )}
            </div>
          </div>
        </div>

        {/* Messages container */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-[#1c2030] to-[#16171f]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-10 h-10 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400 mt-4">Loading chat...</p>
            </div>
          ) : (
            <>
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="bg-[#252b3d]/50 p-4 rounded-lg text-center mx-auto max-w-sm">
                    <p className="text-gray-300 mb-2">No messages yet</p>
                    {hasTargetUserInfo && (
                      <p className="text-gray-400 text-sm">
                        Send a message to start the conversation with{" "}
                        {targetUser.firstName}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-[#252b3d]/50 p-3 rounded-lg text-center mx-auto max-w-xs mb-6">
                    <p className="text-gray-400 text-sm">
                      {hasTargetUserInfo
                        ? `Chat with ${targetUser.firstName} ${
                            targetUser.lastName || ""
                          }`
                        : "Chat started"}
                    </p>
                  </div>

                  {messages.map((msg, index) => {
                    // Check if message has the new format with senderId object
                    const senderId =
                      typeof msg.senderId === "object"
                        ? msg.senderId._id
                        : msg.sender;
                    const isFromMe = senderId === userId;

                    // Get timestamp from appropriate field
                    const timestamp = msg.createdAt || msg.timestamp;
                    const validDate =
                      timestamp && !isNaN(new Date(timestamp).getTime());

                    // Get sender info (for avatar and possibly name)
                    const senderInfo =
                      typeof msg.senderId === "object" ? msg.senderId : null;
                    const senderName = senderInfo
                      ? `${senderInfo.firstName} ${senderInfo.lastName || ""}`
                      : "";
                    const senderPhoto = senderInfo?.photoUrl;

                    return (
                      <div
                        key={msg._id || index}
                        className={`flex ${
                          isFromMe ? "justify-end" : "justify-start"
                        } mb-4`}
                      >
                        {!isFromMe && (
                          <div className="w-8 h-8 rounded-full overflow-hidden mr-2 self-end mb-1 border border-purple-400/30">
                            <img
                              src={
                                senderPhoto ||
                                targetUser?.photoUrl ||
                                DEFAULT_AVATAR
                              }
                              alt="Avatar"
                              className="w-full h-full object-cover bg-gray-700"
                              onError={(e) => {
                                if (e.target.src !== DEFAULT_AVATAR) {
                                  e.target.src = DEFAULT_AVATAR;
                                }
                              }}
                            />
                          </div>
                        )}

                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            isFromMe
                              ? "bg-[#7C3AED] text-white rounded-tr-none"
                              : "bg-[#252b3d] text-gray-200 rounded-tl-none"
                          }`}
                        >
                          <p>{msg.text}</p>
                          <p className="text-xs opacity-70 text-right mt-1">
                            {validDate
                              ? new Date(timestamp).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : ""}
                          </p>
                        </div>

                        {isFromMe && (
                          <div className="w-8 h-8 rounded-full overflow-hidden ml-2 self-end mb-1 border border-purple-400/30">
                            <img
                              src={user?.photoUrl || DEFAULT_AVATAR}
                              alt="Avatar"
                              className="w-full h-full object-cover bg-gray-700"
                              onError={(e) => {
                                if (e.target.src !== DEFAULT_AVATAR) {
                                  e.target.src = DEFAULT_AVATAR;
                                }
                              }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Message input */}
        <div className="p-4 bg-[#252b3d] border-t border-gray-800">
          <form onSubmit={handleSendMessage} className="flex items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 mx-3 px-4 py-3 bg-[#1c2030] border border-gray-700 rounded-lg text-gray-200 focus:border-[#7C3AED] focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#7C3AED] text-white p-3 rounded-lg hover:bg-[#6025c0] transition-colors flex items-center justify-center shadow-lg shadow-[#7C3AED]/20 cursor-pointer"
              disabled={!newMessage.trim() || loading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Chat;
