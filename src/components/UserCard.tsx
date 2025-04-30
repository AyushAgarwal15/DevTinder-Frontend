import React from "react";
import { User } from "../utils/types";
import RegularUserCard from "./RegularUserCard";
import PremiumUserCard from "./PremiumUserCard";
import { useSelector } from "react-redux";
import { RootState } from "../utils/types";

interface UserCardProps {
  user: User;
  onHandleSendRequest: ((id: string, status: string) => void) | null;
  enableDrag?: boolean;
  isPreview?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onHandleSendRequest,
  enableDrag = true,
  isPreview = false,
}) => {
  const currentUser = useSelector((state: RootState) => state.user);

  // Check if this is the currently logged in user viewing their own card
  const isOwnProfile = currentUser?._id === user._id;

  // Check if this is the app owner's profile
  const isOwner = user._id === "6811e038d0543553cc3a0dbc";

  if (isOwner) {
    return (
      <PremiumUserCard
        user={user}
        onHandleSendRequest={
          isOwnProfile || isPreview ? null : onHandleSendRequest
        }
        enableDrag={enableDrag && !isOwnProfile && !isPreview}
      />
    );
  }

  return (
    <RegularUserCard
      user={user}
      onHandleSendRequest={
        isOwnProfile || isPreview ? null : onHandleSendRequest
      }
      enableDrag={enableDrag && !isOwnProfile && !isPreview}
    />
  );
};

export default UserCard;
