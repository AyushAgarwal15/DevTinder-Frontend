import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Outlet, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { useToast } from "../context/ToastContext";
import Loader from "./Loader";
import { AppDispatch, RootState, User } from "../utils/types";

const Body: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((store: RootState) => store.user);
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async (): Promise<void> => {
    if (user) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const res = await axios.get<User>(`${BASE_URL}/profile/view`, {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      const error = err as AxiosError;
      if (error.response && error.response.status === 401) {
        toast.info("Please login to continue");
        navigate("/login");
      } else {
        console.error(err);
        toast.error("Failed to fetch user profile");
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    // Try to fetch user data on initial load
    fetchUser();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Body;
