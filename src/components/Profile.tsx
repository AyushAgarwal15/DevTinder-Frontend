import React, { useState } from "react";
import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";
import UserCard from "./UserCard";
import { RootState, User } from "../utils/types";

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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Preview Profile
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
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
