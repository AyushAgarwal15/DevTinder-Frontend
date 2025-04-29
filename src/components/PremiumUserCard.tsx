import React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { User } from "../utils/types";
import { RiVipCrownFill } from "react-icons/ri";

interface PremiumUserCardProps {
  user: User;
  onHandleSendRequest: ((id: string, status: string) => void) | null;
}

const PremiumUserCard: React.FC<PremiumUserCardProps> = ({
  user,
  onHandleSendRequest,
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

  return (
    <div className="relative">
      {/* Premium badge */}
      <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-amber-500 to-yellow-300 px-2 py-1 rounded-full flex items-center text-xs font-bold shadow-lg">
        <RiVipCrownFill className="text-amber-100 mr-1" />
        <span className="text-shimmer">DEVELOPER</span>
      </div>

      {/* Overlay for "IGNORE" action */}
      <motion.div
        className="absolute top-6 left-6 bg-red-500 text-white px-4 py-2 rounded-lg font-bold z-10 transform -rotate-12"
        style={{ opacity: leftOpacity }}
      >
        IGNORE
      </motion.div>

      {/* Overlay for "LIKE" action */}
      <motion.div
        className="absolute top-6 right-6 bg-green-500 text-white px-4 py-2 rounded-lg font-bold z-10 transform rotate-12"
        style={{ opacity: rightOpacity }}
      >
        LIKE
      </motion.div>

      <motion.div
        className="card w-96 overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl bg-[#1c2030] border border-gray-800 cursor-grab active:cursor-grabbing premium-card"
        drag={onHandleSendRequest ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        style={{
          x,
          rotate,
          ...cardStyle,
        }}
        whileDrag={{ scale: 0.98 }}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  className="filter drop-shadow-[0_0_2px_rgba(255,215,0,0.5)]"
                >
                  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                </svg>
              </a>

              <a
                href={githubUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:text-gray-100 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  className="filter drop-shadow-[0_0_2px_rgba(255,215,0,0.5)]"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>
              </a>

              <a
                href={portfolioUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:text-green-400 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  className="filter drop-shadow-[0_0_2px_rgba(255,215,0,0.5)]"
                >
                  <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855-.143.268-.276.56-.395.872.705.157 1.472.257 2.282.287V1.077zM4.249 3.539c.142-.384.304-.744.481-1.078a6.7 6.7 0 0 1 .597-.933A7.01 7.01 0 0 0 3.051 3.05c.362.184.763.349 1.198.49zM3.509 7.5c.036-1.07.188-2.087.436-3.008a9.124 9.124 0 0 1-1.565-.667A6.964 6.964 0 0 0 1.018 7.5h2.49zm1.4-2.741a12.344 12.344 0 0 0-.4 2.741H7.5V5.091c-.91-.03-1.783-.145-2.591-.332zM8.5 5.09V7.5h2.99a12.342 12.342 0 0 0-.399-2.741c-.808.187-1.681.301-2.591.332zM4.51 8.5c.035.987.176 1.914.399 2.741A13.612 13.612 0 0 1 7.5 10.91V8.5H4.51zm3.99 0v2.409c.91.03 1.783.145 2.591.332.223-.827.364-1.754.4-2.741H8.5zm-3.282 3.696c.12.312.252.604.395.872.552 1.035 1.218 1.65 1.887 1.855V11.91c-.81.03-1.577.13-2.282.287zm.11 2.276a6.696 6.696 0 0 1-.598-.933 8.853 8.853 0 0 1-.481-1.079 8.38 8.38 0 0 0-1.198.49 7.01 7.01 0 0 0 2.276 1.522zm-1.383-2.964A13.36 13.36 0 0 1 3.508 8.5h-2.49a6.963 6.963 0 0 0 1.362 3.675c.47-.258.995-.482 1.565-.667zm6.728 2.964a7.009 7.009 0 0 0 2.275-1.521 8.376 8.376 0 0 0-1.197-.49 8.853 8.853 0 0 1-.481 1.078 6.688 6.688 0 0 1-.597.933zM8.5 11.909v3.014c.67-.204 1.335-.82 1.887-1.855.143-.268.276-.56.395-.872A12.63 12.63 0 0 0 8.5 11.91zm3.555-.401c.57.185 1.095.409 1.565.667A6.963 6.963 0 0 0 14.982 8.5h-2.49a13.36 13.36 0 0 1-.437 3.008zM14.982 7.5a6.963 6.963 0 0 0-1.362-3.675c-.47.258-.995.482-1.565.667.248.92.4 1.938.437 3.008h2.49zM11.27 2.461c.177.334.339.694.482 1.078a8.368 8.368 0 0 0 1.196-.49 7.01 7.01 0 0 0-2.275-1.52c.218.283.418.597.597.932zm-.488 1.343a7.765 7.765 0 0 0-.395-.872C9.835 1.897 9.17 1.282 8.5 1.077V4.09c.81-.03 1.577-.13 2.282-.287z" />
                </svg>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
                onClick={(e) => {
                  e.stopPropagation();
                  onHandleSendRequest(_id, "interested");
                }}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 shadow-lg shadow-amber-800/30 transition-colors flex items-center justify-center text-white border-none cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PremiumUserCard;
