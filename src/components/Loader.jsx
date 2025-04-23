import React from "react";

/**
 * A simple circular loader component
 * @param {Object} props
 * @param {string} props.size - Size of the loader (small, medium, large)
 * @param {string} props.text - Optional text to display below the loader
 */
const Loader = ({ size = "medium", text = "" }) => {
  // Determine size based on prop
  const sizeClasses = {
    small: "w-6 h-6 border-2",
    medium: "w-10 h-10 border-3",
    large: "w-16 h-16 border-4",
  };

  const sizeClass = sizeClasses[size] || sizeClasses.medium;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <div
          className={`${sizeClass} rounded-full border-t-[#7C3AED] border-r-[#7C3AED] border-b-[#7C3AED]/30 border-l-[#7C3AED]/30 animate-spin shadow-lg`}
        ></div>
        <div className="absolute inset-0 rounded-full shadow-[0_0_10px_rgba(124,58,237,0.5)] animate-pulse"></div>
      </div>
      {text && <p className="mt-4 text-gray-300 text-sm font-medium">{text}</p>}
    </div>
  );
};

export default Loader;
