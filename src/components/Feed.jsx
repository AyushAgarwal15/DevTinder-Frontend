import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUserToTheFeed, removeUserFromFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";
import { useToast } from "../context/ToastContext";
import Loader from "./Loader";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const fetchFeed = async () => {
    if (feed) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await axios.get(BASE_URL + "/feed", {
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

  const handleSendRequest = async (id, status) => {
    try {
      await axios.post(
        BASE_URL + `/request/send/${status}/${id}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(id));
      if (status === "interested") toast.success("Connection request sent!");
      if (status === "ignored") toast.success("User Ignored!");
    } catch (err) {
      const errorMessage = err?.response?.data || "Failed to accept request";
      toast.error(errorMessage);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  return (
    <div className="min-h-screen bg-[#1c2030] py-8 px-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-[70vh]">
          <Loader size="large" text="Finding Matches..." />
        </div>
      ) : feed?.length > 0 ? (
        <div className="flex justify-center my-10">
          <UserCard user={feed[0]} onHandleSendRequest={handleSendRequest} />
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
