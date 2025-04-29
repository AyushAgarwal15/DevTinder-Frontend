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

  // Modern card style with subtle gradient
  const cardStyle = {
    background: "linear-gradient(135deg, #1e293b 0%, #111827 100%)",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
  };

  // Card motion animation
  const cardAnimation = {
    initial: { opacity: 0, scale: 0.9 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    whileHover: {
      boxShadow: "0 15px 30px rgba(0, 0, 0, 0.6)",
      transition: { duration: 0.2 },
    },
  };

  // Determine if dragging should be allowed
  const isDraggable = enableDrag && onHandleSendRequest !== null;

  return (
    <div className="relative flex justify-center w-full">
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
        className={`card w-full max-w-sm sm:max-w-md overflow-hidden rounded-2xl transition-all duration-300 border border-gray-700 ${
          isDraggable ? "cursor-grab active:cursor-grabbing" : "cursor-default"
        }`}
        drag={isDraggable ? "x" : false}
        dragConstraints={isDraggable ? { left: 0, right: 0 } : undefined}
        dragElastic={isDraggable ? 0.7 : undefined}
        onDragEnd={isDraggable ? handleDragEnd : undefined}
        style={{
          ...(isDraggable ? { x, rotate } : {}),
          ...cardStyle,
        }}
        whileDrag={isDraggable ? { scale: 0.98 } : undefined}
        dragTransition={
          isDraggable ? { bounceStiffness: 600, bounceDamping: 20 } : undefined
        }
        {...cardAnimation}
      >
        <figure className="relative h-56 sm:h-60 overflow-hidden pointer-events-none bg-gradient-to-b from-gray-900 to-gray-800">
          {photoUrl && (
            <img
              src={photoUrl}
              alt={name || "User profile"}
              className="w-full h-full object-contain object-center"
              draggable="false"
            />
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-4">
            <div className="flex items-center">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white truncate">
                  {name}
                </h2>
                <p className="text-gray-300/90 text-xs sm:text-sm">
                  {age ? `${age}, ` : ""}
                  {gender || "Developer"}
                </p>
              </div>
            </div>
          </div>
        </figure>

        <div className="card-body p-4 sm:p-5 pointer-events-none">
          <p className="text-gray-300 text-sm mb-3 line-clamp-3">{about}</p>

          {skills && skills.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-300 mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {skills.slice(0, 5).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-full text-xs shadow-md"
                  >
                    {skill}
                  </span>
                ))}
                {skills.length > 5 && (
                  <span className="px-2 py-1 bg-gray-600 text-white shadow-md rounded-full text-xs">
                    +{skills.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Social Links */}
          {hasSocialLinks && (
            <div className="mb-3">
              <div className="flex gap-3">
                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-400 pointer-events-auto transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaLinkedin size={18} />
                  </a>
                )}

                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-200 hover:text-white pointer-events-auto transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaGithub size={18} />
                  </a>
                )}

                {portfolioUrl && (
                  <a
                    href={portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 hover:text-green-400 pointer-events-auto transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaGlobe size={18} />
                  </a>
                )}
              </div>
            </div>
          )}

          {onHandleSendRequest && (
            <div className="card-actions justify-end mt-1 pointer-events-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onHandleSendRequest(_id, "ignored");
                }}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-500 hover:bg-red-600 shadow-lg shadow-red-800/20 transition-all hover:scale-105 flex items-center justify-center text-white border-none cursor-pointer"
                aria-label="Ignore"
              >
                <FaTimes className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onHandleSendRequest(_id, "interested");
                }}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] shadow-lg shadow-purple-900/30 transition-all hover:scale-105 flex items-center justify-center text-white border-none cursor-pointer"
                aria-label="Like"
              >
                <FaHeart className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RegularUserCard;
