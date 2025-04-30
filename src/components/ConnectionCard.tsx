import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { removeConnection } from "../utils/connectionSlice";
import { BASE_URL } from "../utils/constants";
import { useToast } from "../context/ToastContext";
import ConfirmationModal from "./ConfirmationModal";
import {
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";
import { BsChatDots } from "react-icons/bs";

interface Connection {
  _id: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  about?: string;
  age?: number;
  gender?: string;
  skills?: string[];
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
}

interface ConnectionCardProps {
  connection: Connection;
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({ connection }) => {
  const {
    _id,
    firstName,
    lastName,
    photoUrl,
    about,
    age,
    gender,
    skills = [],
    linkedinUrl,
    githubUrl,
    portfolioUrl,
  } = connection;

  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);
  const dispatch = useDispatch();
  const toast = useToast();

  // Check if user has any social links
  const hasSocialLinks = linkedinUrl || githubUrl || portfolioUrl;

  const handleRemoveConnection = async (): Promise<void> => {
    try {
      setIsRemoving(true);
      await axios.delete(`${BASE_URL}/user/connections/${_id}`, {
        withCredentials: true,
      });

      dispatch(removeConnection(_id));
      toast.success(`Removed connection with ${firstName} ${lastName}`);
      setShowConfirmDialog(false);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Failed to remove connection";
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="bg-[#252b3d] rounded-lg border border-gray-800 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#7C3AED]/10 hover:border-[#7C3AED]/30 h-full flex flex-col">
      <div className="relative">
        <div className="h-32 w-full bg-gradient-to-r from-[#7C3AED]/20 to-[#6D28D9]/20">
          {/* Social Links in banner */}
          {hasSocialLinks && (
            <div className="absolute top-4 right-4 flex gap-3">
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="LinkedIn Profile"
                  className="bg-[#252b3d]/80 p-2 rounded-full hover:bg-[#252b3d] transition-colors"
                >
                  <FaLinkedin size={18} className="text-blue-500" />
                </a>
              )}

              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="GitHub Profile"
                  className="bg-[#252b3d]/80 p-2 rounded-full hover:bg-[#252b3d] transition-colors"
                >
                  <FaGithub size={18} className="text-gray-200" />
                </a>
              )}

              {portfolioUrl && (
                <a
                  href={portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Portfolio Website"
                  className="bg-[#252b3d]/80 p-2 rounded-full hover:bg-[#252b3d] transition-colors"
                >
                  <FaGlobe size={18} className="text-green-500" />
                </a>
              )}
            </div>
          )}
        </div>
        <div className="absolute bottom-0 transform translate-y-1/2 left-6">
          <div className="w-20 h-20 rounded-full border-4 border-[#252b3d] overflow-hidden bg-gray-800">
            <img
              src={photoUrl || "https://via.placeholder.com/150"}
              alt={`${firstName} ${lastName}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "https://via.placeholder.com/150?text=Dev";
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
          <div className="flex space-x-2">
            <Link
              to={"/chat/" + _id}
              className="p-2 rounded-lg bg-[#7C3AED]/10 hover:bg-[#7C3AED]/20 text-[#7C3AED] transition-colors cursor-pointer"
              title="Message"
            >
              <BsChatDots className="h-5 w-5" />
            </Link>

            <button
              onClick={() => setShowConfirmDialog(true)}
              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors cursor-pointer"
              title="Remove Connection"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
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

        {/* View Profile Button */}
        <div className="mt-6">
          <Link
            to={`/user/${_id}`}
            className="w-full flex items-center justify-center gap-2 py-2 bg-[#252b3d] border border-[#7C3AED]/30 text-[#7C3AED] rounded-lg hover:bg-[#7C3AED]/10 transition-colors"
          >
            <FaUserCircle />
            View Full Profile
          </Link>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleRemoveConnection}
        title="Remove Connection"
        message={`Are you sure you want to remove ${firstName} ${lastName} from your connections?`}
        confirmText="Remove"
        isLoading={isRemoving}
        loadingText="Removing..."
      />
    </div>
  );
};

export default ConnectionCard;
