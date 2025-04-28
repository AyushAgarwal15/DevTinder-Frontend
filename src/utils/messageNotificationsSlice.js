import { createSlice } from "@reduxjs/toolkit";

const messageNotificationsSlice = createSlice({
  name: "messageNotifications",
  initialState: {
    unreadCount: 0,
    notifications: [], // Will store {userId, firstName, lastName, photoUrl, lastMessage, timestamp}
  },
  reducers: {
    addNotification: (state, action) => {
      // Check if notification from this user already exists
      const existingIndex = state.notifications.findIndex(
        (n) => n.userId === action.payload.userId
      );

      if (existingIndex !== -1) {
        // Update existing notification
        state.notifications[existingIndex] = {
          ...action.payload,
          isRead: false,
        };
      } else {
        // Add new notification
        state.notifications.unshift({
          ...action.payload,
          isRead: false,
        });
      }

      // Recalculate unread count
      state.unreadCount = state.notifications.filter((n) => !n.isRead).length;
    },
    markAsRead: (state, action) => {
      // Mark specific notification as read
      const userId = action.payload;
      const index = state.notifications.findIndex((n) => n.userId === userId);

      if (index !== -1) {
        state.notifications[index].isRead = true;
        // Recalculate unread count
        state.unreadCount = state.notifications.filter((n) => !n.isRead).length;
      }
    },
    markAllAsRead: (state) => {
      // Mark all notifications as read
      state.notifications.forEach((n) => (n.isRead = true));
      state.unreadCount = 0;
    },
    removeAllNotifications: (state) => {
      state.unreadCount = 0;
      state.notifications = [];
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeAllNotifications,
} = messageNotificationsSlice.actions;

export default messageNotificationsSlice.reducer;
