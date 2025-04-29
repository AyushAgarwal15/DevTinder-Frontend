import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { useToast } from "../context/ToastContext";
import ConnectionCard from "./ConnectionCard";
import { Link, useLocation } from "react-router-dom";
import { RootState } from "../utils/types";

interface Connection {
  _id: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  about?: string;
  age?: number;
  gender?: string;
  skills?: string[];
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
}

const Connections: React.FC = () => {
  const connections = useSelector((store: RootState) => store.connections) as
    | Connection[]
    | null;
  const dispatch = useDispatch();
  const toast = useToast();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchConnections = async (force = false): Promise<void> => {
    if (connections && !force) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const res = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
      });
      dispatch(addConnections(res?.data?.data));
      setIsLoading(false);
    } catch (err: any) {
      const errorMessage = err?.response?.data || "Something went wrong";
      toast.error(errorMessage);
      console.error(err);
      setIsLoading(false);
    }
  };

  const filteredConnections = connections?.filter(
    (connection: Connection) =>
      connection.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (connection.skills &&
        connection.skills.some((skill: string) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        ))
  );

  useEffect(() => {
    fetchConnections();
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#1c2030] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#7C3AED]">
              Your Connections
            </h2>
            <p className="text-gray-400 mt-1">
              Stay connected with fellow developers
            </p>
          </div>
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Search connections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 px-4 py-2 bg-[#252b3d] border border-gray-700 rounded-lg text-gray-200 focus:border-[#7C3AED] focus:outline-none pr-10"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader size="large" text="Loading connections..." />
          </div>
        ) : filteredConnections && filteredConnections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConnections.map((connection: Connection) => (
              <ConnectionCard key={connection._id} connection={connection} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-[#252b3d] rounded-lg border border-gray-800">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4861/4861245.png"
              alt="No connections"
              className="w-32 h-32 mb-6 opacity-30"
            />
            <h3 className="text-xl font-medium text-gray-300 mb-2">
              {searchTerm
                ? "No matching connections found"
                : "No connections yet"}
            </h3>
            <p className="text-gray-400 text-center max-w-md mb-8">
              {searchTerm
                ? `Try a different search term or clear your search`
                : `Start swiping to match with other developers and build your network!`}
            </p>
            {!searchTerm && (
              <Link
                to="/"
                className="px-6 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors cursor-pointer"
              >
                Find Developers
              </Link>
            )}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="px-6 py-2 bg-[#252b3d] border border-gray-700 text-gray-300 rounded-lg hover:bg-[#1c2030] transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;
