import React from "react";
import { User } from "../utils/types";
import RegularUserCard from "./RegularUserCard";
import PremiumUserCard from "./PremiumUserCard";

interface UserCardProps {
  user: User;
  onHandleSendRequest: ((id: string, status: string) => void) | null;
}

const UserCard: React.FC<UserCardProps> = ({ user, onHandleSendRequest }) => {
  // Check if this is the app owner's profile
  const isOwner = user._id === "6810df27f815e450e4660312";

  if (isOwner) {
    return (
      <PremiumUserCard user={user} onHandleSendRequest={onHandleSendRequest} />
    );
  }

  return (
    <RegularUserCard user={user} onHandleSendRequest={onHandleSendRequest} />
  );
};

export default UserCard;
