import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import Toast from "../components/Toast";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

interface ToastContextType {
  showToast: (options: {
    message: string;
    type?: ToastType;
    duration?: number;
  }) => number;
  removeToast: (id: number) => void;
  success: (message: string, duration?: number) => number;
  error: (message: string, duration?: number) => number;
  warning: (message: string, duration?: number) => number;
  info: (message: string, duration?: number) => number;
}

// Create context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

// Custom hook to use the toast context
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// Toast provider component
export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Add a new toast
  const showToast = useCallback(
    ({
      message,
      type = "success",
      duration = 3000,
    }: {
      message: string;
      type?: ToastType;
      duration?: number;
    }): number => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type, duration }]);
      return id;
    },
    []
  );

  // Remove a toast by ID
  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Helper functions for different toast types
  const success = useCallback(
    (message: string, duration = 3000) =>
      showToast({ message, type: "success", duration }),
    [showToast]
  );

  const error = useCallback(
    (message: string, duration = 3000) =>
      showToast({ message, type: "error", duration }),
    [showToast]
  );

  const warning = useCallback(
    (message: string, duration = 3000) =>
      showToast({ message, type: "warning", duration }),
    [showToast]
  );

  const info = useCallback(
    (message: string, duration = 3000) =>
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
