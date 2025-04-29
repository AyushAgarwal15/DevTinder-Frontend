import type { RootState, AppDispatch } from "./appStore";

// Re-export the types
export type { RootState, AppDispatch };

// User interface
export interface User {
  _id: string;
  firstName: string;
  lastName?: string;
  emailId?: string;
  about?: string;
  location?: string;
  photoUrl?: string;
  skills?: string[];
  githubUrl?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  age?: number;
  gender?: string;
  // Legacy properties for compatibility
  name?: string;
  email?: string;
  bio?: string;
  profilePic?: string;
  githubProfile?: string;
}

// Message interface
export interface Message {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  createdAt: string;
  read: boolean;
}

// Connection interface
export interface Connection {
  _id: string;
  userId: string;
  name: string;
  profilePic?: string;
  skills?: string[];
}

// Connection Request interface
export interface ConnectionRequest {
  _id: string;
  sender: User;
  receiver: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}
