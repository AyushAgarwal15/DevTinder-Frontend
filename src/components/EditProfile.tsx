import axios from "axios";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import { useToast } from "../context/ToastContext";
import ButtonLoader from "./ButtonLoader";
import Loader from "./Loader";
import { AppDispatch } from "../utils/types";

// User interface that matches the app's structure
interface User {
  _id: string;
  firstName: string;
  lastName?: string;
  photoUrl?: string;
  gender?: string;
  age?: number;
  about?: string;
  skills?: string[];
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  emailId: string;
}

// Form data interface
interface FormData {
  firstName: string;
  lastName: string;
  photoUrl: string;
  gender: string;
  age: string;
  about: string;
  skills: string[];
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
}

interface EditProfileProps {
  user: User | null;
}

const EditProfile: React.FC<EditProfileProps> = ({ user }) => {
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    photoUrl: "",
    gender: "",
    age: "",
    about: "",
    skills: [],
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        photoUrl: user.photoUrl || "",
        gender: user.gender || "",
        age: user.age ? String(user.age) : "",
        about: user.about || "",
        skills: Array.isArray(user.skills) ? [...user.skills] : [],
        linkedinUrl: user.linkedinUrl || "",
        githubUrl: user.githubUrl || "",
        portfolioUrl: user.portfolioUrl || "",
      });
      setIsFormLoading(false);
    }
  }, [user]);

  // Reset image loading state when photoUrl changes
  useEffect(() => {
    if (!formData.photoUrl) {
      setIsImageLoading(true);
    }
  }, [formData.photoUrl]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillAdd = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent form submission on Enter key except in textarea
    if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
      e.preventDefault();

      // If Enter is pressed in skill input, add the skill
      if ((e.target as HTMLInputElement).name === "skillInput") {
        handleSkillAdd();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      setError("");

      const response = await axios.patch(
        BASE_URL + "/profile/edit",
        { ...formData },
        { withCredentials: true }
      );
      dispatch(addUser(response?.data?.data));
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      setError(err?.response?.data || "Something went wrong 💀");
      toast.error(
        err?.response?.data || "Something went wrong updating your profile"
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {isFormLoading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <Loader size="large" text="Loading your profile..." />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          className="space-y-6"
        >
          {/* Profile Photo */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gray-700 border-2 border-[#7C3AED] overflow-hidden relative">
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <Loader size="small" />
                </div>
              )}
              <img
                src={formData.photoUrl || "https://via.placeholder.com/150"}
                alt="Profile"
                className={`w-full h-full object-cover object-top ${
                  isImageLoading ? "opacity-0" : "opacity-100"
                } transition-opacity duration-300`}
                onLoad={() => setIsImageLoading(false)}
                onError={() => setIsImageLoading(false)}
              />
            </div>
          </div>

          <div className="form-control mb-6">
            <label className="block text-gray-400 mb-2">
              Profile Photo URL
            </label>
            <input
              type="url"
              name="photoUrl"
              value={formData.photoUrl}
              onChange={handleChange}
              placeholder="Enter photo URL"
              className="w-full px-4 py-3 bg-[#1c2030] border border-gray-700 rounded-lg text-gray-200 focus:border-[#7C3AED] focus:outline-none"
            />
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="form-control">
              <label className="block text-gray-400 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                className="w-full px-4 py-3 bg-[#1c2030] border border-gray-700 rounded-lg text-gray-200 focus:border-[#7C3AED] focus:outline-none"
              />
            </div>

            <div className="form-control">
              <label className="block text-gray-400 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                className="w-full px-4 py-3 bg-[#1c2030] border border-gray-700 rounded-lg text-gray-200 focus:border-[#7C3AED] focus:outline-none"
              />
            </div>

            <div className="form-control">
              <label className="block text-gray-400 mb-2">Email</label>
              <input
                type="email"
                name="emailId"
                readOnly
                value={user?.emailId || ""}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed focus:outline-none"
              />
            </div>

            <div className="form-control">
              <label className="block text-gray-400 mb-2">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age || ""}
                onChange={handleChange}
                placeholder="Enter age"
                className="w-full px-4 py-3 bg-[#1c2030] border border-gray-700 rounded-lg text-gray-200 focus:border-[#7C3AED] focus:outline-none"
              />
            </div>

            <div className="form-control col-span-full">
              <label className="block text-gray-400 mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#1c2030] border border-gray-700 rounded-lg text-gray-200 focus:border-[#7C3AED] focus:outline-none"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* About */}
          <div className="form-control">
            <label className="block text-gray-400 mb-2">About</label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              className="w-full px-4 py-3 bg-[#1c2030] border border-gray-700 rounded-lg text-gray-200 focus:border-[#7C3AED] focus:outline-none min-h-[120px] resize-none"
            />
          </div>

          {/* Skills */}
          <div className="form-control">
            <label className="block text-gray-400 mb-2">Skills</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="skillInput"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Add a skill"
                className="flex-1 px-4 py-3 bg-[#1c2030] border border-gray-700 rounded-lg text-gray-200 focus:border-[#7C3AED] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSkillAdd}
                className="px-6 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors cursor-pointer"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {formData.skills.map((skill, index) => (
                <div
                  key={index}
                  className="px-3 py-1 bg-[#7C3AED] text-white rounded-full flex items-center gap-2"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleSkillRemove(skill)}
                    className="text-white hover:text-gray-200 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="form-control">
            <h3 className="text-lg font-semibold text-gray-300 mb-4">
              Social Links
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">
                  <span className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="text-blue-500"
                      viewBox="0 0 16 16"
                    >
                      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                    </svg>
                    LinkedIn URL
                  </span>
                </label>
                <input
                  type="url"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-4 py-3 bg-[#1c2030] border border-gray-700 rounded-lg text-gray-200 focus:border-[#7C3AED] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">
                  <span className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="text-gray-200"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                    </svg>
                    GitHub URL
                  </span>
                </label>
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                  className="w-full px-4 py-3 bg-[#1c2030] border border-gray-700 rounded-lg text-gray-200 focus:border-[#7C3AED] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">
                  <span className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="text-green-500"
                      viewBox="0 0 16 16"
                    >
                      <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855-.143.268-.276.56-.395.872.705.157 1.472.257 2.282.287V1.077zM4.249 3.539c.142-.384.304-.744.481-1.078a6.7 6.7 0 0 1 .597-.933A7.01 7.01 0 0 0 3.051 3.05c.362.184.763.349 1.198.49zM3.509 7.5c.036-1.07.188-2.087.436-3.008a9.124 9.124 0 0 1-1.565-.667A6.964 6.964 0 0 0 1.018 7.5h2.49zm1.4-2.741a12.344 12.344 0 0 0-.4 2.741H7.5V5.091c-.91-.03-1.783-.145-2.591-.332zM8.5 5.09V7.5h2.99a12.342 12.342 0 0 0-.399-2.741c-.808.187-1.681.301-2.591.332zM4.51 8.5c.035.987.176 1.914.399 2.741A13.612 13.612 0 0 1 7.5 10.91V8.5H4.51zm3.99 0v2.409c.91.03 1.783.145 2.591.332.223-.827.364-1.754.4-2.741H8.5zm-3.282 3.696c.12.312.252.604.395.872.552 1.035 1.218 1.65 1.887 1.855V11.91c-.81.03-1.577.13-2.282.287zm.11 2.276a6.696 6.696 0 0 1-.598-.933 8.853 8.853 0 0 1-.481-1.079 8.38 8.38 0 0 0-1.198.49 7.01 7.01 0 0 0 2.276 1.522zm-1.383-2.964A13.36 13.36 0 0 1 3.508 8.5h-2.49a6.963 6.963 0 0 0 1.362 3.675c.47-.258.995-.482 1.565-.667zm6.728 2.964a7.009 7.009 0 0 0 2.275-1.521 8.376 8.376 0 0 0-1.197-.49 8.853 8.853 0 0 1-.481 1.078 6.688 6.688 0 0 1-.597.933zM8.5 11.909v3.014c.67-.204 1.335-.82 1.887-1.855.143-.268.276-.56.395-.872A12.63 12.63 0 0 0 8.5 11.91zm3.555-.401c.57.185 1.095.409 1.565.667A6.963 6.963 0 0 0 14.982 8.5h-2.49a13.36 13.36 0 0 1-.437 3.008zM14.982 7.5a6.963 6.963 0 0 0-1.362-3.675c-.47.258-.995.482-1.565.667.248.92.4 1.938.437 3.008h2.49zM11.27 2.461c.177.334.339.694.482 1.078a8.368 8.368 0 0 0 1.196-.49 7.01 7.01 0 0 0-2.275-1.52c.218.283.418.597.597.932zm-.488 1.343a7.765 7.765 0 0 0-.395-.872C9.835 1.897 9.17 1.282 8.5 1.077V4.09c.81-.03 1.577-.13 2.282-.287z" />
                    </svg>
                    Portfolio URL
                  </span>
                </label>
                <input
                  type="url"
                  name="portfolioUrl"
                  value={formData.portfolioUrl}
                  onChange={handleChange}
                  placeholder="https://yourdomain.com"
                  className="w-full px-4 py-3 bg-[#1c2030] border border-gray-700 rounded-lg text-gray-200 focus:border-[#7C3AED] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {error && <p className="text-red-500">{error}</p>}
          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2 text-white rounded-lg transition-colors cursor-pointer ${
                isLoading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-[#7C3AED] hover:bg-[#6D28D9]"
              }`}
            >
              {isLoading ? <ButtonLoader text="Saving..." /> : "Save Changes"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditProfile;
