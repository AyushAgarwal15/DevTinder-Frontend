import React, { useEffect } from "react";
import axios from "axios";
import { Outlet, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { useToast } from "../context/ToastContext";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);
  const toast = useToast();

  const fetchUser = async () => {
    if (userData) return;
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (err) {
      if (err.status === 401) {
        toast.info("Please login to continue");
        navigate("/login");
      } else {
        console.error(err);
        toast.error("Failed to fetch user profile");
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Body;
