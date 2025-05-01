import React, { useState } from "react";
import Loader from "./Loader";
import UserDetailModal from "./UserDetailModal";
import ConfirmationModal from "./ConfirmationModal";
import { User } from "../utils/types";
import { IoEyeOutline } from "react-icons/io5";
import { FaTimes, FaCheck, FaUserCircle } from "react-icons/fa";

interface RequestCardProps {
  request: User;
  requestId: string;
  onHandleRequest: (id: string, status: "accepted" | "rejected") => void;
  isProcessing: boolean;
}

const RequestCard: React.FC<RequestCardProps> = ({
  request,
  requestId,
  onHandleRequest,
  isProcessing,
}) => {
  const [imageError, setImageError] = useState<boolean>(false);
  const [showUserDetails, setShowUserDetails] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<{
    show: boolean;
    status: "accepted" | "rejected" | null;
  }>({
    show: false,
    status: null,
  });

  const handleConfirmAction = () => {
    if (confirmAction.status) {
      onHandleRequest(requestId, confirmAction.status);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between bg-[#252b3d] p-4 rounded-lg mb-4 border border-gray-800 hover:bg-[#2d354a] transition-colors relative cursor-pointer">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#7C3AED] bg-gray-800">
            <img
              src={
                !imageError
                  ? request?.photoUrl
                  : "https://via.placeholder.com/150?text=Dev"
              }
              alt={`${request.firstName} ${request.lastName}`}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          </div>
          <div className="ml-4">
            <h3 className="text-gray-200 font-medium">
              {request.firstName} {request.lastName}
            </h3>
            <p className="text-gray-400 text-sm">
              Developer{" "}
              {request.skills && request.skills.length > 0
                ? `• ${request.skills[0]}`
                : ""}
            </p>
          </div>
        </div>

        <div className="flex gap-2 z-10">
          <button
            onClick={() => setShowUserDetails(true)}
            className="p-2 rounded-lg border border-gray-600 hover:bg-blue-500/10 hover:border-blue-500 hover:text-blue-500 transition-colors cursor-pointer"
            aria-label="View profile"
          >
            <IoEyeOutline className="h-5 w-5" />
          </button>
          <button
            onClick={() => setConfirmAction({ show: true, status: "rejected" })}
            disabled={isProcessing}
            className="p-2 rounded-lg border border-gray-600 hover:bg-red-500/10 hover:border-red-500 hover:text-red-500 transition-colors cursor-pointer"
          >
            <FaTimes className="h-5 w-5" />
          </button>
          <button
            onClick={() => setConfirmAction({ show: true, status: "accepted" })}
            disabled={isProcessing}
            className="p-2 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white transition-colors flex items-center gap-2 cursor-pointer"
          >
            {isProcessing ? (
              <Loader size="small" />
            ) : (
              <>
                <FaCheck className="h-5 w-5" />
                Accept
              </>
            )}
          </button>
        </div>
      </div>

      {/* User Details Modal */}
      <UserDetailModal
        user={request}
        isOpen={showUserDetails}
        onClose={() => setShowUserDetails(false)}
      />

      {/* Confirmation Modal for Accept */}
      {confirmAction.status === "accepted" && (
        <ConfirmationModal
          isOpen={confirmAction.show}
          onClose={() => setConfirmAction({ show: false, status: null })}
          onConfirm={handleConfirmAction}
          title="Accept Connection"
          message={`Are you sure you want to accept the connection request from ${request.firstName} ${request.lastName}?`}
          confirmText="Accept"
          confirmButtonClass="bg-[#7C3AED] hover:bg-[#6D28D9]"
          isLoading={isProcessing}
          loadingText="Accepting..."
        />
      )}

      {/* Confirmation Modal for Reject */}
      {confirmAction.status === "rejected" && (
        <ConfirmationModal
          isOpen={confirmAction.show}
          onClose={() => setConfirmAction({ show: false, status: null })}
          onConfirm={handleConfirmAction}
          title="Reject Connection"
          message={`Are you sure you want to reject the connection request from ${request.firstName} ${request.lastName}?`}
          confirmText="Reject"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
          isLoading={isProcessing}
          loadingText="Rejecting..."
        />
      )}
    </>
  );
};

export default RequestCard;
