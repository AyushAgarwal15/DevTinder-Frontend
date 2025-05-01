import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUserToTheFeed, removeUserFromFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";
import { useToast } from "../context/ToastContext";
import Loader from "./Loader";
import {
  motion,
  AnimatePresence,
  MotionStyle,
  Variant,
  Variants,
} from "framer-motion";
import { AppDispatch, RootState, User } from "../utils/types";
import {
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaTimes,
  FaSync,
} from "react-icons/fa";

type ExitDirection = "left" | "right" | null;

interface CardVariants {
  hidden: Variant;
  visible: Variant;
  exit: (direction: ExitDirection) => Variant;
}

const Feed: React.FC = () => {
  const user = useSelector((store: RootState) => store.user);
  const feed = useSelector((store: RootState) => store.feed);
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [exitDirection, setExitDirection] = useState<ExitDirection>(null);
  const [showGuide, setShowGuide] = useState(true);

  // Auto-hide guide after a few seconds
  useEffect(() => {
    if (showGuide) {
      const timer = setTimeout(() => {
        setShowGuide(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [showGuide]);

  const fetchFeed = async (): Promise<void> => {
    if (!user) return;
    try {
      setIsLoading(true);
      const res = await axios.get<{ data: User[] }>(`${BASE_URL}/feed`, {
        withCredentials: true,
      });
      dispatch(addUserToTheFeed(res?.data?.data));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load feed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendRequest = async (
    id: string,
    status: string
  ): Promise<void> => {
    try {
      // Set exit direction for animation
      setExitDirection(status === "interested" ? "right" : "left");

      // Wait for animation and then make API call
      setTimeout(async () => {
        await axios.post(
          `${BASE_URL}/request/send/${status}/${id}`,
          {},
          { withCredentials: true }
        );
        dispatch(removeUserFromFeed(id));
        if (status === "interested") toast.success("Connection request sent!");
        if (status === "ignored") toast.success("User Ignored!");

        // Reset exit direction and card exiting state
        setExitDirection(null);
      }, 300);
    } catch (err: any) {
      const errorMessage = err?.response?.data || "Failed to accept request";
      toast.error(errorMessage);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  // Card variants for framer-motion
  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: (direction: ExitDirection) => ({
      x:
        direction === "left"
          ? "calc(-100% - 50px)"
          : direction === "right"
          ? "calc(100% + 50px)"
          : 0,
      opacity: 0,
      rotate: direction === "left" ? -20 : direction === "right" ? 20 : 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    }),
  };

  // Guide animation to show swiping
  const guideVariants: Variants = {
    swipeRight: {
      x: [0, "calc(30% - 10px)", 0],
      opacity: [0.5, 1, 0.5],
      transition: { duration: 2, repeat: 1, repeatType: "reverse" as const },
    },
    swipeLeft: {
      x: [0, "calc(-30% + 10px)", 0],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: 1,
        repeatType: "reverse" as const,
        delay: 4,
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#1c2030] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-[#7C3AED]">
            Discover Developers
          </h2>
          {!isLoading && (
            <button
              onClick={fetchFeed}
              className="flex items-center gap-2 px-4 py-2 bg-[#252b3d] text-gray-300 hover:bg-[#303952] rounded-lg transition-colors cursor-pointer"
            >
              <FaSync className={isLoading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Refresh Feed</span>
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-[70vh]">
          <Loader size="large" text="Finding Matches..." />
        </div>
      ) : feed && feed.length > 0 ? (
        <div className="flex justify-center my-10 min-h-[550px] h-auto relative">
          {/* Visual guide overlay */}
          {showGuide && (
            <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
              <div className="relative w-full max-w-96 h-96 flex items-center justify-center">
                {/* Right swipe guide */}
                <motion.div
                  className="absolute right-0 sm:right-[-50px] top-1/2 transform -translate-y-1/2 bg-green-500/80 text-white px-3 py-2 rounded-lg cursor-default"
                  variants={guideVariants}
                  animate="swipeRight"
                >
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold">Like</span>
                    <FaHeart className="h-5 w-5" />
                  </div>
                </motion.div>

                {/* Left swipe guide */}
                <motion.div
                  className="absolute left-0 sm:left-[-50px] top-1/2 transform -translate-y-1/2 bg-red-500/80 text-white px-3 py-2 rounded-lg cursor-default"
                  variants={guideVariants}
                  animate="swipeLeft"
                >
                  <div className="flex items-center gap-1">
                    <FaTimes className="h-5 w-5" />
                    <span className="text-sm font-bold">Ignore</span>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          <AnimatePresence custom={exitDirection}>
            {/* Properly positioned card stack */}
            <div className="relative w-full max-w-96 h-auto min-h-[550px]">
              {/* Background card first (lower z-index) */}
              {feed && feed.length > 1 && (
                <motion.div
                  key={feed[1]._id + "-bg"}
                  className="absolute"
                  style={
                    {
                      zIndex: 1,
                      top: "25px",
                      left: "-15px",
                      filter: "brightness(0.85)",
                      transform: "scale(0.95) rotate(-6deg)",
                      transformOrigin: "center top",
                      boxShadow: "0 7px 15px rgba(0, 0, 0, 0.3)",
                      transition: "all 0.3s ease-in-out",
                      width: "100%",
                    } as MotionStyle
                  }
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 0.95,
                    transition: { duration: 0.3 },
                  }}
                >
                  <div className="pointer-events-none relative">
                    <UserCard
                      user={feed[1]}
                      onHandleSendRequest={handleSendRequest}
                      isPreview={true}
                    />
                    <div className="absolute inset-0 bg-black/50 rounded-lg"></div>
                  </div>
                </motion.div>
              )}

              {/* Foreground (active) card */}
              {feed && feed.length > 0 && (
                <motion.div
                  key={feed[0]._id}
                  className="absolute"
                  style={
                    {
                      zIndex: 2,
                      transformOrigin: "center top",
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
                      width: "100%",
                    } as MotionStyle
                  }
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={cardVariants}
                  custom={exitDirection}
                >
                  <UserCard
                    user={feed[0]}
                    onHandleSendRequest={handleSendRequest}
                  />
                </motion.div>
              )}
            </div>
          </AnimatePresence>
        </div>
      ) : (
        <p className="text-2xl text-center text-gray-400 my-50">
          Sorry, No User Found 😥
        </p>
      )}
    </div>
  );
};

export default Feed;
