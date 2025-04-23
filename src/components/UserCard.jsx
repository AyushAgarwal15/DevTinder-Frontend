import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const UserCard = ({ user, onHandleSendRequest }) => {
  const { firstName, lastName, photoUrl, age, gender, about, skills, _id } =
    user;

  // Track the card's position as it's dragged
  const x = useMotionValue(0);

  // Transform x position to rotation (tilting the card as it's dragged)
  const rotate = useTransform(x, [-200, 0, 200], [-10, 0, 10]);

  // Transform x position to opacity for the action indicators
  const leftOpacity = useTransform(x, [-100, 0], [1, 0]);
  const rightOpacity = useTransform(x, [0, 100], [0, 1]);

  // Function to handle drag end (swiping)
  const handleDragEnd = (_, info) => {
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

  return (
    <div className="relative">
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
        className="card w-96 overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl bg-[#1c2030] border border-gray-800 cursor-grab active:cursor-grabbing"
        drag={onHandleSendRequest ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        style={{ x, rotate }}
        whileDrag={{ scale: 0.98 }}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
      >
        <figure className="relative h-64 overflow-hidden pointer-events-none">
          <img
            src={photoUrl}
            alt={`${firstName} ${lastName}`}
            className="w-full h-full object-contain"
            draggable="false"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h2 className="text-2xl font-bold text-white">
              {firstName} {lastName}
            </h2>
            <p className="text-white/90 text-sm">
              {age}, {gender}
            </p>
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

          <div className="card-actions justify-end mt-2 pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onHandleSendRequest(_id, "ignored");
              }}
              className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center text-white border-none cursor-pointer"
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
              className="w-12 h-12 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] transition-colors flex items-center justify-center text-white border-none cursor-pointer"
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
        </div>
      </motion.div>
    </div>
  );
};

export default UserCard;
