import React from "react";
import Logo from "./Logo";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1c2030] text-gray-300 py-4 mt-auto border-t border-gray-800">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl flex flex-col md:flex-row items-center md:justify-between gap-6">
        <div className="flex items-center">
          <Logo />
        </div>
        <div className="max-w-2xl text-center md:text-left">
          <p className="text-gray-400 text-sm md:text-base mb-4">
            Connect with like-minded developers. DevTinder helps you find the
            perfect coding partner for projects, mentorship, or collaboration.
          </p>
          <p className="text-gray-500 text-xs">
            © 2025 DevTinder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
