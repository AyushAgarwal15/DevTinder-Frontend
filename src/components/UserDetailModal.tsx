import React, { useRef, useEffect } from "react";
import { User } from "../utils/types";
import UserCard from "./UserCard";
import { IoClose } from "react-icons/io5";

interface UserDetailModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div
        ref={modalRef}
        className="relative w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors z-10 cursor-pointer"
          aria-label="Close modal"
        >
          <IoClose size={20} />
        </button>
        <UserCard user={user} onHandleSendRequest={null} />
      </div>
    </div>
  );
};

export default UserDetailModal;
