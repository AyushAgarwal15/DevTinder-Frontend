import React from "react";
import authThumbnail from "../assets/images/auth_thumbnail.jpeg";

interface AuthThumbnailProps {
  className?: string;
  showOverlayText?: boolean;
}

const AuthThumbnail: React.FC<AuthThumbnailProps> = ({
  className = "",
  showOverlayText = true,
}) => {
  return (
    <div className={`hidden lg:block lg:w-1/2 relative ${className}`}>
      <img
        src={authThumbnail}
        alt="Developers connecting"
        className="w-full h-full object-cover"
      />
      {showOverlayText && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#1c2030]/40 to-[#7C3AED]/30">
          <div className="absolute bottom-10 left-10 max-w-md">
            <h2 className="text-4xl font-bold mb-3 text-white drop-shadow-lg">
              Connect with developers worldwide
            </h2>
            <p className="text-white text-xl drop-shadow-md">
              Find your perfect coding partner on DevTinder
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthThumbnail;
