import React, { useState } from "react";
import Loader from "./Loader";

const RequestCard = ({ request, requestId, onHandleRequest, isProcessing }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex items-center justify-between bg-[#252b3d] p-4 rounded-lg mb-4 border border-gray-800">
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#7C3AED] bg-gray-800">
          <img
            src={
              !imageError
                ? request.photoUrl
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
      <div className="flex gap-2">
        <button
          onClick={() => onHandleRequest(requestId, "rejected")}
          disabled={isProcessing}
          className="p-2 rounded-lg border border-gray-600 hover:bg-red-500/10 hover:border-red-500 hover:text-red-500 transition-colors cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <button
          onClick={() => onHandleRequest(requestId, "accepted")}
          disabled={isProcessing}
          className="p-2 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white transition-colors flex items-center gap-2 cursor-pointer"
        >
          {isProcessing ? (
            <Loader size="small" />
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Accept
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RequestCard;
