import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { markAllAsRead, markAsRead } from "../utils/messageNotificationsSlice";
import { RootState } from "../utils/types";

// Default avatar for fallback
const DEFAULT_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666666'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

interface MessageNotification {
  userId: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  lastMessage: string;
  timestamp: string;
  isRead: boolean;
}

const timeAgo = (timestamp: string): string => {
  if (!timestamp) return "";

  const now = new Date();
  const date = new Date(timestamp);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return Math.floor(seconds / 60) + "m ago";
  if (seconds < 86400) return Math.floor(seconds / 3600) + "h ago";
  if (seconds < 604800) return Math.floor(seconds / 86400) + "d ago";

  return date.toLocaleDateString();
};

const Messages: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, unreadCount } = useSelector(
    (state: RootState) => state.messageNotifications
  );

  useEffect(() => {
    console.log("Notifications in Messages component:", notifications);
    console.log("Unread count:", unreadCount);
  }, [notifications, unreadCount]);

  const handleNavigateToChat = (e: React.MouseEvent, userId: string): void => {
    e.preventDefault();
    e.stopPropagation();

    console.log("Navigating to chat with user:", userId);

    // Mark this notification as read
    dispatch(markAsRead(userId));

    // Close any open dropdowns first by blurring the active element
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    // Navigate to the chat
    setTimeout(() => {
      window.location.href = `/chat/${userId}`;
    }, 50);
  };

  return (
    <div className="py-2 max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-2">
        <h3 className="text-lg font-semibold text-gray-300">Messages</h3>
        {notifications.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              dispatch(markAllAsRead());
            }}
            className="text-xs text-[#7C3AED] hover:text-[#6D28D9] transition-colors cursor-pointer"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 px-4">
          <div className="w-16 h-16 bg-[#252b3d] rounded-full flex items-center justify-center mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <p className="text-gray-400 text-center mb-1">No messages yet</p>
          <p className="text-gray-500 text-sm text-center">
            New messages will appear here
          </p>
        </div>
      ) : (
        <div className="mt-1">
          {notifications.map((notification: MessageNotification) => (
            <div
              key={notification.userId}
              onClick={(e) => handleNavigateToChat(e, notification.userId)}
              className={`flex items-start gap-3 px-4 py-3 hover:bg-[#252b3d] cursor-pointer transition-colors ${
                !notification.isRead
                  ? "border-l-2 border-[#7C3AED] bg-[#7C3AED]/5"
                  : ""
              }`}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={notification.photoUrl || DEFAULT_AVATAR}
                    alt={`${notification.firstName}'s profile`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== DEFAULT_AVATAR) {
                        target.src = DEFAULT_AVATAR;
                      }
                    }}
                  />
                </div>
                {!notification.isRead && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-[#7C3AED] rounded-full border-2 border-[#1c2030]"></span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-200 truncate">
                    {notification.firstName} {notification.lastName}
                  </h4>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {timeAgo(notification.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-400 truncate mt-1">
                  {notification.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Messages;
