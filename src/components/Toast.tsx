import React, { useEffect, useState } from "react";
import { ToastType } from "../context/ToastContext";
import {
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";

interface ToastProps {
  /** Message to display */
  message: string;
  /** Type of toast (success, error, warning, info) */
  type?: ToastType;
  /** Duration in ms before auto-dismissing */
  duration?: number;
  /** Function to call when toast is closed */
  onClose?: () => void;
}

/**
 * Toast component for displaying notifications
 */
const Toast: React.FC<ToastProps> = ({
  message,
  type = "success",
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  // Set timeout to automatically dismiss toast
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  // Handle close button click
  const handleClose = () => {
    setIsLeaving(true);

    // Use a timeout to wait for the animation to complete
    const animationTimeout = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300); // Match this to the animation duration in CSS

    return () => clearTimeout(animationTimeout);
  };

  // If not visible, don't render
  if (!isVisible) return null;

  // Toast type styles
  const typeStyles = {
    success: {
      bg: "bg-green-500",
      icon: <FaCheck className="h-6 w-6" />,
    },
    error: {
      bg: "bg-red-500",
      icon: <FaTimes className="h-6 w-6" />,
    },
    warning: {
      bg: "bg-yellow-500",
      icon: <FaExclamationTriangle className="h-6 w-6" />,
    },
    info: {
      bg: "bg-blue-500",
      icon: <FaInfoCircle className="h-6 w-6" />,
    },
  };

  const { bg, icon } = typeStyles[type] || typeStyles.info;

  return (
    <div
      className={`fixed top-4 right-4 z-50 ${
        isLeaving ? "animate-fade-out-up" : "animate-fade-in-down"
      }`}
    >
      <div
        className={`${bg} text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between min-w-[300px] max-w-md transform transition-all duration-300`}
      >
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">{icon}</div>
          <p className="font-medium">{message}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className="text-white ml-4 focus:outline-none hover:text-gray-200 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <FaTimes className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
