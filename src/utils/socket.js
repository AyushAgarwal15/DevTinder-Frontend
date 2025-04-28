import io from "socket.io-client";
import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
  // Get token from cookies
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const token = getCookie("token");
  console.log(token);

  return io(BASE_URL, {
    auth: {
      token: token,
    },
  });
};
