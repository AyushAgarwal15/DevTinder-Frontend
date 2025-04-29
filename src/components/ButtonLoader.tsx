import React from "react";
import Loader from "./Loader";

interface ButtonLoaderProps {
  /** Text to display alongside the loader */
  text?: string;
}

/**
 * A button loader component for inline use in buttons
 */
const ButtonLoader: React.FC<ButtonLoaderProps> = ({ text = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Loader size="small" />
      <span>{text}</span>
    </div>
  );
};

export default ButtonLoader;
