import React from "react";
import Loader from "./Loader";

/**
 * A button loader component for inline use in buttons
 * @param {Object} props
 * @param {string} props.text - Text to display alongside the loader
 */
const ButtonLoader = ({ text = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Loader size="small" />
      <span>{text}</span>
    </div>
  );
};

export default ButtonLoader;
