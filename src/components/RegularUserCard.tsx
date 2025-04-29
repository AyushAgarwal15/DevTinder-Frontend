import React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { User } from "../utils/types";
import {
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaHeart,
  FaTimes,
} from "react-icons/fa";

interface RegularUserCardProps {
  user: User;
  onHandleSendRequest: ((id: string, status: string) => void) | null;
  enableDrag?: boolean;
}

const RegularUserCard: React.FC<RegularUserCardProps> = ({
  user,
  onHandleSendRequest,
  enableDrag = true,
}) => {
  const {
    _id,
    firstName,
    lastName,
    photoUrl,
    age,
    gender,
    about,
    skills,
    linkedinUrl,
    githubUrl,
    portfolioUrl,
  } = user;

  // Full name
  const name = firstName ? `${firstName} ${lastName || ""}` : "";

  // Track the card's position as it's dragged
  const x = useMotionValue(0);

  // Transform x position to rotation (tilting the card as it's dragged)
  const rotate = useTransform(x, [-200, 0, 200], [-10, 0, 10]);

  // Transform x position to opacity for the action indicators
  const leftOpacity = useTransform(x, [-100, 0], [1, 0]);
  const rightOpacity = useTransform(x, [0, 100], [0, 1]);

  // Function to handle drag end (swiping)
  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    if (!onHandleSendRequest) return;

    // Swipe threshold
    const threshold = 100;

    if (info.offset.x > threshold) {
      // Swiped right - interested
      onHandleSendRequest(_id, "interested");
    } else if (info.offset.x < -threshold) {
      // Swiped left - ignored
      onHandleSendRequest(_id, "ignored");
    }
  };

  // Check if user has any social links
  const hasSocialLinks = linkedinUrl || githubUrl || portfolioUrl;

  // Determine if dragging should be allowed
  const isDraggable = enableDrag && onHandleSendRequest !== null;

  return (
    <div className="relative">
      {/* Overlay for "IGNORE" action */}
      {isDraggable && (
        <motion.div
          className="absolute top-6 left-6 bg-red-500 text-white px-4 py-2 rounded-lg font-bold z-10 transform -rotate-12"
          style={{ opacity: leftOpacity }}
        >
          IGNORE
        </motion.div>
      )}

      {/* Overlay for "LIKE" action */}
      {isDraggable && (
        <motion.div
          className="absolute top-6 right-6 bg-green-500 text-white px-4 py-2 rounded-lg font-bold z-10 transform rotate-12"
          style={{ opacity: rightOpacity }}
        >
          LIKE
        </motion.div>
      )}

      <motion.div
        className={`card w-96 overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl bg-[#1c2030] border border-gray-800 ${
          isDraggable ? "cursor-grab active:cursor-grabbing" : "cursor-default"
        }`}
        drag={isDraggable ? "x" : false}
        dragConstraints={isDraggable ? { left: 0, right: 0 } : undefined}
        dragElastic={isDraggable ? 0.7 : undefined}
        onDragEnd={isDraggable ? handleDragEnd : undefined}
        style={{
          ...(isDraggable ? { x, rotate } : {}),
        }}
        whileDrag={isDraggable ? { scale: 0.98 } : undefined}
        dragTransition={
          isDraggable ? { bounceStiffness: 600, bounceDamping: 20 } : undefined
        }
      >
        <figure className="relative h-64 overflow-hidden pointer-events-none">
          <img
            src={photoUrl}
            alt={name || "User profile"}
            className="w-full h-full object-contain"
            draggable="false"
          />

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div className="flex items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">{name}</h2>
                <p className="text-white/90 text-sm">
                  {age}, {gender}
                </p>
              </div>
            </div>
          </div>
        </figure>

        <div className="card-body p-5 pointer-events-none">
          <p className="text-gray-400 mb-3">{about}</p>

          {skills && skills.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-400 mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#7C3AED] text-white rounded-full text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social Links */}
          {hasSocialLinks && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-400 mb-2">
                Connect
              </p>
              <div className="flex gap-3">
                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-400 pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaLinkedin size={20} />
                  </a>
                )}

                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-200 hover:text-gray-100 pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaGithub size={20} />
                  </a>
                )}

                {portfolioUrl && (
                  <a
                    href={portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 hover:text-green-400 pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaGlobe size={20} />
                  </a>
                )}
              </div>
            </div>
          )}

          {onHandleSendRequest && (
            <div className="card-actions justify-end mt-2 pointer-events-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onHandleSendRequest(_id, "ignored");
                }}
                className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center text-white border-none cursor-pointer"
              >
                <FaTimes className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onHandleSendRequest(_id, "interested");
                }}
                className="w-12 h-12 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] transition-colors flex items-center justify-center text-white border-none cursor-pointer"
              >
                <FaHeart className="h-6 w-6" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RegularUserCard;
