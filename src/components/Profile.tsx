import React, { useState } from "react";
import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";
import UserCard from "./UserCard";
import { RootState, User } from "../utils/types";
import { FaEye, FaEdit } from "react-icons/fa";

const Profile: React.FC = () => {
  const user = useSelector((store: RootState) => store.user);
  const [isEditing, setIsEditing] = useState(true);

  // Dummy handler for UserCard to satisfy its props requirement
  const handleProfileViewOnly = (_id: string, _action: string) => {
    // This is a view-only card, no action needed
    console.log("Profile view only, no action taken");
  };

  return (
    <div className="min-h-screen bg-[#1c2030] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-[#7C3AED]">
            {isEditing ? "Edit Profile" : "Profile Preview"}
          </h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors flex items-center gap-2 cursor-pointer"
          >
            {isEditing ? (
              <>
                <FaEye className="h-5 w-5" />
                Preview Profile
              </>
            ) : (
              <>
                <FaEdit className="h-5 w-5" />
                Edit Profile
              </>
            )}
          </button>
        </div>

        {isEditing ? (
          user && <EditProfile user={user as any} />
        ) : (
          <div className="flex justify-center">
            {user && (
              <UserCard
                user={user as any}
                onHandleSendRequest={handleProfileViewOnly}
                enableDrag={false}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
