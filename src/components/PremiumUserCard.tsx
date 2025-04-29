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
} from "react-icons/fa";

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

  // Premium card style with golden gradient
  const cardStyle = {
    background: "linear-gradient(135deg, #000000 0%, #1c2030 100%)",
    boxShadow: "0 0 20px rgba(255, 215, 0, 0.3)",
    border: "1px solid rgba(255, 215, 0, 0.5)",
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
      boxShadow: "0 0 25px rgba(255, 215, 0, 0.5)",
      transition: { duration: 0.2 },
    },
  };

  // Determine if dragging should be allowed
  const isDraggable = enableDrag && onHandleSendRequest !== null;

  return (
    <div className="relative">
      {/* Premium badge */}
      <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-amber-500 to-yellow-300 px-2 py-1 rounded-full flex items-center text-xs font-bold shadow-lg">
        <RiVipCrownFill className="text-amber-100 mr-1" />
        <span className="text-shimmer">DEVELOPER</span>
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
        className={`card w-96 overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl bg-[#1c2030] border border-gray-800 ${
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
        <figure className="relative h-64 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full z-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-yellow-500/10 to-transparent"></div>
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-yellow-500/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-xl"></div>
          </div>

          <img
            src={photoUrl}
            alt={name || "User profile"}
            className="w-full h-full object-contain scale-95 filter contrast-110"
            draggable="false"
          />

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-4">
            <div className="flex items-center">
              <div>
                <h2 className="text-2xl font-bold text-yellow-400">
                  {name}
                  <span className="ml-2 inline-block animate-pulse">👑</span>
                </h2>
                <p className="text-yellow-200/90 text-sm">
                  {age}, {gender}
                </p>
              </div>

              <div className="ml-auto bg-gradient-to-r from-yellow-600 to-yellow-400 text-black text-xs px-2 py-1 rounded-full font-bold border border-yellow-300 shadow-lg">
                FOUNDER
              </div>
            </div>
          </div>
        </figure>

        <div className="card-body p-5 pointer-events-none bg-gradient-to-b from-[#1c2030] to-[#1c1e28]">
          <div className="mb-3 flex">
            <div className="bg-gradient-to-r from-purple-600 to-blue-500 mr-2 px-2 py-0.5 rounded text-xs text-white font-semibold">
              DevTinder Creator
            </div>
            <div className="bg-gradient-to-r from-gray-700 to-gray-600 px-2 py-0.5 rounded text-xs text-white font-semibold">
              Full-Stack Developer
            </div>
          </div>

          <p className="text-gray-300 mb-3">
            {about ||
              "Creator and lead developer of DevTinder - connecting developers worldwide!"}
          </p>

          <div className="mb-4">
            <p className="text-sm font-semibold text-yellow-400 mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {skills && skills.length > 0 ? (
                skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-yellow-600 to-amber-500 text-black shadow-md shadow-amber-900/20 rounded-full text-xs"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <>
                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-600 to-amber-500 text-black shadow-md shadow-amber-900/20 rounded-full text-xs">
                    React
                  </span>
                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-600 to-amber-500 text-black shadow-md shadow-amber-900/20 rounded-full text-xs">
                    TypeScript
                  </span>
                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-600 to-amber-500 text-black shadow-md shadow-amber-900/20 rounded-full text-xs">
                    Node.js
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className="mb-4">
            <p className="text-sm font-semibold text-yellow-400 mb-2">
              Connect
            </p>
            <div className="flex gap-3">
              <a
                href={linkedinUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:text-blue-400 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <FaLinkedin
                  size={20}
                  className="filter drop-shadow-[0_0_2px_rgba(255,215,0,0.5)]"
                />
              </a>

              <a
                href={githubUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:text-gray-100 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <FaGithub
                  size={20}
                  className="filter drop-shadow-[0_0_2px_rgba(255,215,0,0.5)]"
                />
              </a>

              <a
                href={portfolioUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:text-green-400 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <FaGlobe
                  size={20}
                  className="filter drop-shadow-[0_0_2px_rgba(255,215,0,0.5)]"
                />
              </a>
            </div>
          </div>

          <div className="border-t border-yellow-700/30 mt-3 pt-3">
            <p className="text-yellow-400 text-xs italic">
              "Connecting developers worldwide through innovation and passion."
            </p>
          </div>

          {onHandleSendRequest && (
            <div className="card-actions justify-end mt-2 pointer-events-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onHandleSendRequest(_id, "ignored");
                }}
                className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 shadow-lg shadow-red-800/30 transition-colors flex items-center justify-center text-white border-none cursor-pointer"
              >
                <FaTimes className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onHandleSendRequest(_id, "interested");
                }}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 shadow-lg shadow-amber-800/30 transition-colors flex items-center justify-center text-white border-none cursor-pointer"
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

export default PremiumUserCard;
