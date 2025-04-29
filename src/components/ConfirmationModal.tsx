import React from "react";
import { BiLoaderAlt } from "react-icons/bi";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  confirmButtonClass?: string;
  isLoading?: boolean;
  loadingText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  confirmButtonClass = "bg-red-600 hover:bg-red-700",
  isLoading = false,
  loadingText = "Processing...",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-[#252b3d] rounded-lg p-6 max-w-md w-full mx-4 shadow-lg border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-300 mb-6">{message}</p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center cursor-pointer ${confirmButtonClass}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <BiLoaderAlt className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                {loadingText}
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
