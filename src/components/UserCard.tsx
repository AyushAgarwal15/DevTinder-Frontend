import React from "react";
import { User } from "../utils/types";
import RegularUserCard from "./RegularUserCard";
import PremiumUserCard from "./PremiumUserCard";

interface UserCardProps {
  user: User;
  onHandleSendRequest: ((id: string, status: string) => void) | null;
  enableDrag?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onHandleSendRequest,
  enableDrag = true,
}) => {
  // Check if this is the app owner's profile
  const isOwner = user._id === "6810df27f815e450e4660312";

  if (isOwner) {
    return (
      <PremiumUserCard
        user={user}
        onHandleSendRequest={onHandleSendRequest}
        enableDrag={enableDrag}
      />
    );
  }

  return (
    <RegularUserCard
      user={user}
      onHandleSendRequest={onHandleSendRequest}
      enableDrag={enableDrag}
    />
  );
};

export default UserCard;
