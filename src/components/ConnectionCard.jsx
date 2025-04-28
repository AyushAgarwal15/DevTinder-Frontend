import React from "react";
import { Link } from "react-router-dom";

const ConnectionCard = ({ connection }) => {
  const {
    _id,
    firstName,
    lastName,
    photoUrl,
    about,
    age,
    gender,
    skills = [],
  } = connection;

  return (
    <div className="bg-[#252b3d] rounded-lg border border-gray-800 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#7C3AED]/10 hover:border-[#7C3AED]/30 h-full flex flex-col">
      <div className="relative">
        <div className="h-32 w-full bg-gradient-to-r from-[#7C3AED]/20 to-[#6D28D9]/20"></div>
        <div className="absolute bottom-0 transform translate-y-1/2 left-6">
          <div className="w-20 h-20 rounded-full border-4 border-[#252b3d] overflow-hidden bg-gray-800">
            <img
              src={photoUrl || "https://via.placeholder.com/150"}
              alt={`${firstName} ${lastName}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/150?text=Dev";
              }}
            />
          </div>
        </div>
      </div>

      <div className="pt-12 p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-white">
              {firstName} {lastName}
            </h3>
            <p className="text-gray-400 text-sm">
              {age} • {gender}
            </p>
          </div>
          <Link
            to={"/chat/" + _id}
            className="p-2 rounded-lg bg-[#7C3AED]/10 hover:bg-[#7C3AED]/20 text-[#7C3AED] transition-colors cursor-pointer"
            title="Message"
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </Link>
        </div>

        <p className="text-gray-300 text-sm mt-3 line-clamp-2">
          {about || "No description available"}
        </p>

        <div className="mt-4 flex-grow">
          {skills && skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-[#7C3AED]/10 text-[#7C3AED] text-xs rounded-full"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 3 && (
                <span className="px-2 py-1 bg-gray-700/30 text-gray-400 text-xs rounded-full">
                  +{skills.length - 3} more
                </span>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-xs italic">No skills listed</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionCard;
