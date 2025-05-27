import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { useToast } from "../context/ToastContext";
import { useEffect, useState } from "react";
import { addRequests, removeRequests } from "../utils/requestSlice";
import { removeConnections } from "../utils/connectionSlice";
import RequestCard from "./RequestCard";
import Loader from "./Loader";
import { RootState, User } from "../utils/types";
import { FaInbox, FaSync, FaUserClock } from "react-icons/fa";

interface Request {
  _id: string;
  fromUserId: User;
  toUserId: string;
  status: string;
  createdAt: string;
}

const Requests = () => {
  const requests = useSelector((store: RootState) => store.requests) as
    | Request[]
    | null;
  const dispatch = useDispatch();
  const toast = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchRequests = async (force = false): Promise<void> => {
    if (requests && !force) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const res = await axios.get(`${BASE_URL}/user/requests/received`, {
        withCredentials: true,
      });
      dispatch(addRequests(res?.data?.data));
      setIsLoading(false);
    } catch (err: any) {
      toast.error(
        "Unable to load connection requests. Please try again later."
      );
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleReceivedRequest = async (
    id: string,
    status: "accepted" | "rejected"
  ) => {
    setProcessingId(id);
    try {
      await axios.post(
        `${BASE_URL}/request/review/${status}/${id}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequests(id));

      if (status === "accepted") {
        // Clear connections in Redux to force a refresh when navigating to connections page
        dispatch(removeConnections());
        toast.success("Connection request accepted successfully!");
      }

      if (status === "rejected") {
        toast.success("Connection request rejected successfully!");
      }
    } catch (err: any) {
      toast.error(
        "Unable to process the connection request. Please try again."
      );
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen bg-[#1c2030] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#7C3AED] flex items-center gap-2">
              <FaInbox className="text-purple-400" />
              Connection Requests
            </h2>
            <p className="text-gray-400 mt-1">
              Accept or reject developers who want to connect with you
            </p>
          </div>

          <button
            onClick={() => fetchRequests(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#252b3d] text-gray-300 hover:bg-[#303952] rounded-lg transition-colors cursor-pointer"
            disabled={isLoading}
          >
            <FaSync className={isLoading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader size="large" text="Loading requests..." />
          </div>
        ) : requests && requests.length > 0 ? (
          <div>
            {requests.map((request) => (
              <RequestCard
                key={request._id}
                request={request.fromUserId}
                requestId={request._id}
                onHandleRequest={handleReceivedRequest}
                isProcessing={processingId === request._id}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-[#252b3d] rounded-lg border border-gray-800">
            <div className="w-24 h-24 bg-[#1c2030] rounded-full flex items-center justify-center mb-6">
              <FaUserClock className="h-12 w-12 text-purple-400 opacity-70" />
            </div>
            <h3 className="text-xl font-medium text-gray-300 mb-2">
              No pending requests
            </h3>
            <p className="text-gray-400 text-center max-w-md">
              When developers want to connect with you, they'll appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;
