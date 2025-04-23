import React, { createContext, useContext, useState, useCallback } from "react";
import Toast from "../components/Toast";

// Create context
const ToastContext = createContext();

// Custom hook to use the toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// Toast provider component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Add a new toast
  const showToast = useCallback(
    ({ message, type = "success", duration = 3000 }) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type, duration }]);
      return id;
    },
    []
  );

  // Remove a toast by ID
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Helper functions for different toast types
  const success = useCallback(
    (message, duration = 3000) =>
      showToast({ message, type: "success", duration }),
    [showToast]
  );

  const error = useCallback(
    (message, duration = 3000) =>
      showToast({ message, type: "error", duration }),
    [showToast]
  );

  const warning = useCallback(
    (message, duration = 3000) =>
      showToast({ message, type: "warning", duration }),
    [showToast]
  );

  const info = useCallback(
    (message, duration = 3000) =>
      showToast({ message, type: "info", duration }),
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{ showToast, removeToast, success, error, warning, info }}
    >
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
