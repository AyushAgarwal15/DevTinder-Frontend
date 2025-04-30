import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useToast } from "../context/ToastContext";
import Loader from "./Loader";
import {
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaVenusMars,
} from "react-icons/fa";
import { BsChatDots } from "react-icons/bs";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  emailId?: string;
  photoUrl?: string;
  about?: string;
  age?: number;
  gender?: string;
  skills?: string[];
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  location?: string;
  githubId?: string;
}

interface GitHubData {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  location: string;
}

interface Repository {
  id: string;
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  language: string;
}

interface GitHubProfileData {
  githubData: GitHubData;
  githubRepos: Repository[];
  githubLanguages: string[];
  topRepositories: Repository[];
  contributionStats: {
    totalRepos: number;
    totalStars: number;
    totalForks: number;
    languages: Record<string, number>;
  };
}

const UserProfileView: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [githubData, setGithubData] = useState<GitHubProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnection, setIsConnection] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${BASE_URL}/profile/view/${userId}`, {
          withCredentials: true,
        });
        setUser(response.data);

        // If user has GitHub connected, fetch GitHub data
        if (response.data.githubId) {
          try {
            const githubResponse = await axios.get(
              `${BASE_URL}/profile/github/${userId}`,
              {
                withCredentials: true,
              }
            );
            setGithubData(githubResponse.data);
          } catch (err) {
            console.error("Failed to fetch GitHub data", err);
            // We don't set an error here because the basic profile should still show
          }
        }

        // Check if the user is a connection
        try {
          const connectionsResponse = await axios.get(
            `${BASE_URL}/user/connections`,
            {
              withCredentials: true,
            }
          );

          const isUserConnection = connectionsResponse.data.data.some(
            (connection: User) => connection._id === userId
          );

          setIsConnection(isUserConnection);
        } catch (err) {
          console.error("Failed to check connection status", err);
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load user profile");
        toast.error("Failed to load user profile");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId, toast]);

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      JavaScript: "#f1e05a",
      TypeScript: "#3178c6",
      Python: "#3572A5",
      Java: "#b07219",
      "C#": "#178600",
      PHP: "#4F5D95",
      Ruby: "#701516",
      Go: "#00ADD8",
      Swift: "#F05138",
      Kotlin: "#A97BFF",
      Rust: "#DEA584",
      HTML: "#e34c26",
      CSS: "#563d7c",
      Shell: "#89e051",
    };

    return colors[language] || "#8B949E";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1c2030] py-8 px-4 flex justify-center items-center">
        <Loader size="large" text="Loading user profile..." />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-[#1c2030] py-8 px-4 flex flex-col justify-center items-center">
        <div className="text-red-500 mb-4 text-xl">
          ⚠️ {error || "User not found"}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1c2030] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors cursor-pointer"
        >
          <FaArrowLeft /> Back
        </button>

        {/* User Profile Header */}
        <div className="bg-[#252b3d] rounded-lg border border-gray-800 overflow-hidden mb-6">
          <div className="h-48 bg-gradient-to-r from-[#7C3AED]/20 to-[#6D28D9]/20 relative">
            <div className="absolute bottom-0 left-0 w-full p-6 pt-20 bg-gradient-to-t from-[#252b3d] to-transparent">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
                <div className="w-32 h-32 rounded-lg border-4 border-[#252b3d] overflow-hidden bg-gray-800 flex-shrink-0">
                  <img
                    src={user.photoUrl || "https://via.placeholder.com/200"}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white">
                    {user.firstName} {user.lastName}
                  </h1>
                  <div className="flex flex-wrap gap-3 text-gray-400 text-sm mt-1">
                    {user.age && (
                      <span className="flex items-center gap-1">
                        <FaBirthdayCake className="text-gray-500" /> {user.age}{" "}
                        years
                      </span>
                    )}
                    {user.gender && (
                      <span className="flex items-center gap-1">
                        <FaVenusMars className="text-gray-500" /> {user.gender}
                      </span>
                    )}
                    {user.location && (
                      <span className="flex items-center gap-1">
                        <FaMapMarkerAlt className="text-gray-500" />{" "}
                        {user.location}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-4 sm:mt-0">
                  {isConnection && (
                    <button
                      onClick={() => navigate(`/chat/${user._id}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors cursor-pointer"
                    >
                      <BsChatDots /> Message
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* About */}
            <h2 className="text-xl font-semibold text-white mb-2">About</h2>
            <p className="text-gray-300 mb-6">
              {user.about || "No information provided."}
            </p>

            {/* Skills */}
            <h2 className="text-xl font-semibold text-white mb-2">Skills</h2>
            {user.skills && user.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-6">
                {user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#7C3AED]/10 text-[#7C3AED] rounded-full text-sm cursor-pointer"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic mb-6">No skills listed</p>
            )}

            {/* Links */}
            <h2 className="text-xl font-semibold text-white mb-2">Links</h2>
            <div className="flex flex-wrap gap-3 mb-6">
              {user.linkedinUrl && (
                <a
                  href={user.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 text-blue-500 rounded-lg hover:bg-blue-600/20 transition-colors cursor-pointer"
                >
                  <FaLinkedin /> LinkedIn
                </a>
              )}

              {user.githubUrl && (
                <a
                  href={user.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700/30 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
                >
                  <FaGithub /> GitHub
                </a>
              )}

              {user.portfolioUrl && (
                <a
                  href={user.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-green-600/10 text-green-500 rounded-lg hover:bg-green-600/20 transition-colors cursor-pointer"
                >
                  <FaGlobe /> Portfolio
                </a>
              )}

              {!user.linkedinUrl && !user.githubUrl && !user.portfolioUrl && (
                <p className="text-gray-500 italic">
                  No external links available
                </p>
              )}
            </div>
          </div>
        </div>

        {/* GitHub Profile Section */}
        {githubData && (
          <div className="bg-[#252b3d] rounded-lg border border-gray-800 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <FaGithub className="text-3xl text-white" />
                <h2 className="text-xl font-semibold text-white">
                  GitHub Profile
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* GitHub Stats */}
                <div className="bg-[#1c2030] rounded-lg p-4">
                  <h3 className="font-medium text-white mb-3">Profile Stats</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#252b3d] p-3 rounded-lg">
                      <div className="text-lg font-semibold text-white">
                        {githubData.githubData.public_repos}
                      </div>
                      <div className="text-xs text-gray-400">Repositories</div>
                    </div>
                    <div className="bg-[#252b3d] p-3 rounded-lg">
                      <div className="text-lg font-semibold text-white">
                        {githubData.contributionStats.totalStars}
                      </div>
                      <div className="text-xs text-gray-400">Total Stars</div>
                    </div>
                    <div className="bg-[#252b3d] p-3 rounded-lg">
                      <div className="text-lg font-semibold text-white">
                        {githubData.githubData.followers}
                      </div>
                      <div className="text-xs text-gray-400">Followers</div>
                    </div>
                    <div className="bg-[#252b3d] p-3 rounded-lg">
                      <div className="text-lg font-semibold text-white">
                        {githubData.contributionStats.totalForks}
                      </div>
                      <div className="text-xs text-gray-400">Total Forks</div>
                    </div>
                  </div>
                </div>

                {/* Top Languages */}
                <div className="bg-[#1c2030] rounded-lg p-4">
                  <h3 className="font-medium text-white mb-3">Top Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {githubData.githubLanguages.map((language) => (
                      <span
                        key={language}
                        className="px-3 py-1 rounded-full text-sm cursor-pointer"
                        style={{
                          backgroundColor: `${getLanguageColor(language)}30`,
                          color: getLanguageColor(language),
                        }}
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Repositories */}
              <h3 className="font-medium text-white mb-3">Top Repositories</h3>
              <div className="grid grid-cols-1 gap-3">
                {githubData.topRepositories.map((repo) => (
                  <div key={repo.id} className="bg-[#1c2030] p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#7C3AED] font-medium hover:underline cursor-pointer"
                      >
                        {repo.name}
                      </a>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span>⭐ {repo.stars}</span>
                        <span>🍴 {repo.forks}</span>
                      </div>
                    </div>

                    {repo.description && (
                      <p className="text-sm text-gray-300 mb-2">
                        {repo.description}
                      </p>
                    )}

                    {repo.language && (
                      <div>
                        <span
                          className="inline-block w-3 h-3 rounded-full mr-1"
                          style={{
                            backgroundColor: getLanguageColor(repo.language),
                          }}
                        ></span>
                        <span className="text-xs text-gray-400 cursor-pointer">
                          {repo.language}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Show message if GitHub not connected */}
        {!githubData && user.githubId === undefined && (
          <div className="bg-[#252b3d] rounded-lg border border-gray-800 p-6 text-center">
            <FaGithub className="text-5xl mx-auto mb-3 text-gray-400" />
            <h3 className="text-lg font-medium text-white mb-2">
              GitHub Not Connected
            </h3>
            <p className="text-gray-400">
              This user hasn't connected their GitHub profile yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileView;
