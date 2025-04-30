import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useToast } from "../context/ToastContext";
import Loader from "./Loader";
import {
  FaGithub,
  FaStar,
  FaCodeBranch,
  FaExternalLinkAlt,
  FaSync,
} from "react-icons/fa";

interface GitHubProfileProps {
  userId: string;
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

interface ContributionStats {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  languages: Record<string, number>;
}

interface GitHubProfileData {
  githubData: GitHubData;
  githubRepos: Repository[];
  githubLanguages: string[];
  topRepositories: Repository[];
  contributionStats: ContributionStats;
}

const GitHubProfile: React.FC<GitHubProfileProps> = ({ userId }) => {
  const [profileData, setProfileData] = useState<GitHubProfileData | null>(
    null
  );
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const toast = useToast();

  useEffect(() => {
    fetchGitHubProfile();
  }, [userId]);

  const fetchGitHubProfile = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}/github/profile`, {
        withCredentials: true,
      });
      setProfileData(response.data);
      setIsConnected(true);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setIsConnected(false);
      } else {
        toast.error("Failed to load GitHub profile");
        console.error("Error fetching GitHub profile:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshGitHubData = async () => {
    try {
      setIsRefreshing(true);
      await axios.post(
        `${BASE_URL}/github/refresh`,
        {},
        {
          withCredentials: true,
        }
      );
      await fetchGitHubProfile();
      toast.success("GitHub data refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh GitHub data");
      console.error("Error refreshing GitHub data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const connectGitHub = () => {
    window.location.href = `${BASE_URL}/connect/github`;
  };

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
      Vue: "#41b883",
      React: "#61dafb",
    };

    return colors[language] || "#8B949E";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader size="medium" text="Loading GitHub profile..." />
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="border border-gray-700 rounded-lg p-6 bg-gray-800 text-white">
        <div className="text-center">
          <FaGithub className="text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Connect GitHub Account</h3>
          <p className="text-gray-400 mb-6">
            Connect your GitHub account to automatically import your
            repositories, contributions, and skills.
          </p>
          <button
            onClick={connectGitHub}
            className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-medium py-2 px-6 rounded-md flex items-center justify-center gap-2 mx-auto"
          >
            <FaGithub className="text-xl" /> Connect GitHub
          </button>
        </div>
      </div>
    );
  }

  const { githubData, topRepositories, contributionStats, githubLanguages } =
    profileData!;

  return (
    <div className="border border-gray-700 rounded-lg p-6 bg-gray-800 text-white">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaGithub className="text-xl" /> GitHub Profile
        </h2>
        <button
          onClick={refreshGitHubData}
          disabled={isRefreshing}
          className="text-gray-400 hover:text-white flex items-center gap-1 text-sm"
        >
          <FaSync className={`${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-4">
          <img
            src={githubData.avatar_url}
            alt={githubData.login}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h3 className="font-semibold text-lg">{githubData.name}</h3>
            <a
              href={githubData.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#7C3AED] hover:underline flex items-center gap-1 text-sm"
            >
              @{githubData.login} <FaExternalLinkAlt className="text-xs" />
            </a>
          </div>
        </div>
        {githubData.bio && (
          <p className="mt-3 text-gray-300">{githubData.bio}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="font-medium mb-3">Profile Stats</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-800 p-3 rounded">
              <div className="text-lg font-semibold">
                {githubData.public_repos}
              </div>
              <div className="text-xs text-gray-400">Repositories</div>
            </div>
            <div className="bg-gray-800 p-3 rounded">
              <div className="text-lg font-semibold">
                {contributionStats.totalStars}
              </div>
              <div className="text-xs text-gray-400">Total Stars</div>
            </div>
            <div className="bg-gray-800 p-3 rounded">
              <div className="text-lg font-semibold">
                {githubData.followers}
              </div>
              <div className="text-xs text-gray-400">Followers</div>
            </div>
            <div className="bg-gray-800 p-3 rounded">
              <div className="text-lg font-semibold">
                {contributionStats.totalForks}
              </div>
              <div className="text-xs text-gray-400">Total Forks</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="font-medium mb-3">Top Languages</h3>
          <div className="flex flex-wrap gap-2">
            {githubLanguages.slice(0, 6).map((language) => (
              <span
                key={language}
                className="px-3 py-1 rounded-full text-sm"
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

      <div className="mb-4">
        <h3 className="font-medium mb-3">Top Repositories</h3>
        <div className="grid grid-cols-1 gap-3 mt-2">
          {topRepositories.map((repo) => (
            <div key={repo.name} className="bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7C3AED] font-medium hover:underline flex items-center"
                >
                  {repo.name} <FaExternalLinkAlt className="ml-1 text-xs" />
                </a>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <FaStar /> {repo.stars}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaCodeBranch /> {repo.forks}
                  </span>
                </div>
              </div>
              {repo.description && (
                <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                  {repo.description}
                </p>
              )}
              {repo.language && (
                <div>
                  <span
                    className="inline-block w-3 h-3 rounded-full mr-1"
                    style={{ backgroundColor: getLanguageColor(repo.language) }}
                  ></span>
                  <span className="text-xs text-gray-400">{repo.language}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GitHubProfile;
