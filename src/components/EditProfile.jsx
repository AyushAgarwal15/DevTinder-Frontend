import axios from "axios";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import { useToast } from "../context/ToastContext";
import ButtonLoader from "./ButtonLoader";
import Loader from "./Loader";

const EditProfile = ({ user }) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    photoUrl: "",
    gender: "",
    age: "",
    about: "",
    skills: [],
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

  const handleChange = (e) => {
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

  const handleSkillRemove = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleKeyDown = (e) => {
    // Prevent form submission on Enter key except in textarea
    if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
      e.preventDefault();

      // If Enter is pressed in skill input, add the skill
      if (e.target.name === "skillInput") {
        handleSkillAdd();
      }
    }
  };

  const handleSubmit = async (e) => {
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
    } catch (err) {
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
