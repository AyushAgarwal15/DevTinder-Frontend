import React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { User } from "../utils/types";
import { RiVipCrownFill } from "react-icons/ri";
import {
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaHeart,
  FaTimes,
  FaUserCircle,
  FaEye,
} from "react-icons/fa";
import { Link } from "react-router-dom";

interface PremiumUserCardProps {
  user: User;
  onHandleSendRequest: ((id: string, status: string) => void) | null;
  enableDrag?: boolean;
}

const PremiumUserCard: React.FC<PremiumUserCardProps> = ({
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

  // Modern card style with refined gradient
  const cardStyle = {
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.7)",
    border: "1px solid rgba(255, 215, 0, 0.3)",
  };

  // Premium card motion animation
  const cardAnimation = {
    initial: { opacity: 0, scale: 0.9 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    whileHover: {
      boxShadow: "0 15px 35px rgba(255, 215, 0, 0.3)",
      transition: { duration: 0.2 },
    },
  };

  // Determine if dragging should be allowed
  const isDraggable = enableDrag && onHandleSendRequest !== null;

  return (
    <div className="relative flex justify-center w-full">
      {/* Premium badge */}
      <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-amber-500 to-yellow-300 px-2 py-1 rounded-full flex items-center text-xs font-bold shadow-lg">
        <RiVipCrownFill className="text-amber-100 mr-1" />
        <span className="text-black font-bold">FOUNDER</span>
      </div>

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
        className={`card w-full max-w-sm sm:max-w-md overflow-hidden rounded-2xl transition-all duration-300 ${
          isDraggable ? "cursor-grab active:cursor-grabbing" : "cursor-default"
        } premium-card`}
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
        {/* View Profile Quick Button */}
        <Link
          to={`/user/${_id}`}
          className="absolute top-3 right-3 z-20 bg-amber-500/80 text-white p-2 rounded-full shadow-lg hover:bg-amber-500 transition-colors pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
          title="View Full Profile"
        >
          <FaEye size={16} />
        </Link>

        <figure className="relative h-56 sm:h-60 overflow-hidden pointer-events-none bg-gradient-to-b from-slate-900 to-slate-800">
          <div className="absolute top-0 left-0 w-full h-full z-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-yellow-500/10 to-transparent"></div>
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-yellow-500/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-xl"></div>
          </div>

          {photoUrl && (
            <img
              src={photoUrl}
              alt={name || "User profile"}
              className="w-full h-full object-contain object-center scale-100"
              draggable="false"
            />
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent p-4">
            <div className="flex items-center">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-amber-400 truncate">
                  {name}
                  <span className="ml-2 inline-block animate-pulse">👑</span>
                </h2>
                <p className="text-amber-200/90 text-xs sm:text-sm">
                  {age ? `${age}, ` : ""}
                  {gender || "Developer"}
                </p>
              </div>
            </div>
          </div>
        </figure>

        <div className="card-body p-4 sm:p-5 pointer-events-none bg-gradient-to-b from-slate-900 to-slate-800">
          <div className="mb-3 flex flex-wrap gap-2">
            <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-2 py-0.5 rounded text-xs text-white font-semibold">
              DevTinder Creator
            </div>
            <div className="bg-gradient-to-r from-gray-700 to-gray-600 px-2 py-0.5 rounded text-xs text-white font-semibold">
              Software Engineer
            </div>
          </div>

          <p className="text-gray-300 text-sm mb-3 line-clamp-3">
            {about ||
              "Creator and lead developer of DevTinder - connecting developers worldwide!"}
          </p>

          <div className="mb-4">
            <p className="text-sm font-semibold text-amber-400 mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {skills && skills.length > 0 ? (
                skills.slice(0, 5).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gradient-to-r from-amber-500 to-amber-400 text-black shadow-md shadow-amber-900/20 rounded-full text-xs cursor-pointer"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <>
                  <span className="px-2 py-1 bg-gradient-to-r from-amber-500 to-amber-400 text-black shadow-md shadow-amber-900/20 rounded-full text-xs cursor-pointer">
                    React
                  </span>
                  <span className="px-2 py-1 bg-gradient-to-r from-amber-500 to-amber-400 text-black shadow-md shadow-amber-900/20 rounded-full text-xs cursor-pointer">
                    TypeScript
                  </span>
                  <span className="px-2 py-1 bg-gradient-to-r from-amber-500 to-amber-400 text-black shadow-md shadow-amber-900/20 rounded-full text-xs cursor-pointer">
                    Node.js
                  </span>
                </>
              )}
              {skills && skills.length > 5 && (
                <span className="px-2 py-1 bg-gradient-to-r from-slate-600 to-slate-500 text-white shadow-md rounded-full text-xs cursor-pointer">
                  +{skills.length - 5} more
                </span>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className="mb-3">
            <div className="flex gap-3">
              <a
                href={linkedinUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-blue-400 pointer-events-auto transition-colors cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <FaLinkedin
                  size={18}
                  className="filter drop-shadow-[0_0_2px_rgba(255,215,0,0.5)]"
                />
              </a>

              <a
                href={githubUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-gray-100 pointer-events-auto transition-colors cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <FaGithub
                  size={18}
                  className="filter drop-shadow-[0_0_2px_rgba(255,215,0,0.5)]"
                />
              </a>

              <a
                href={portfolioUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-green-400 pointer-events-auto transition-colors cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <FaGlobe
                  size={18}
                  className="filter drop-shadow-[0_0_2px_rgba(255,215,0,0.5)]"
                />
              </a>
            </div>
          </div>

          {/* Like/Ignore Buttons */}
          {onHandleSendRequest && (
            <div className="flex justify-between mt-4 gap-4 pointer-events-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onHandleSendRequest(_id, "ignored");
                }}
                className="flex-1 py-2 bg-red-500/10 text-red-500 rounded-lg flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors cursor-pointer"
              >
                <FaTimes />
                <span>Ignore</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onHandleSendRequest(_id, "interested");
                }}
                className="flex-1 py-2 bg-amber-500/10 text-amber-400 rounded-lg flex items-center justify-center gap-2 hover:bg-amber-500/20 transition-colors cursor-pointer"
              >
                <FaHeart />
                <span>Like</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PremiumUserCard;
