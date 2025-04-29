import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../utils/types";

const Logo: React.FC = () => {
  const user = useSelector((store: RootState) => store.user);
  return (
    <div className="flex-1">
      {user !== null ? (
        <Link
          to="/"
          className="btn btn-ghost gap-2 normal-case text-xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:scale-105 transition-transform duration-200 cursor-pointer"
        >
          <span className="text-2xl">💘</span>
          DevTinder
        </Link>
      ) : (
        <Link
          to="/login"
          className="btn btn-ghost gap-2 normal-case text-xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:scale-105 transition-transform duration-200 cursor-pointer"
        >
          <span className="text-2xl">💘</span>
          DevTinder
        </Link>
      )}
    </div>
  );
};

export default Logo;
