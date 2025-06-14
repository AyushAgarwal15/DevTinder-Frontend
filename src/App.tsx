import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import { Provider, useSelector, useDispatch } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./components/Feed";
import ToastProvider from "./context/ToastContext";
import Signup from "./components/Signup";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import Chat from "./components/Chat";
import UserProfileView from "./components/UserProfileView";
import SocketProvider from "./context/SocketContext";
import axios from "axios";
import { BASE_URL } from "./utils/constants";
import { addUser } from "./utils/userSlice";
import { AppDispatch, RootState } from "./utils/types";

// AuthListener component to handle navigation protection
const AuthListener = () => {
  const user = useSelector((store: RootState) => store.user);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const checkAuthOnNavigation = async () => {
      console.log(
        "AuthListener checking auth status at path:",
        location.pathname
      );
      console.log(
        "Current user state:",
        user ? "Authenticated" : "Not authenticated"
      );

      // Special handling for after GitHub auth redirect
      const urlParams = new URLSearchParams(window.location.search);
      const error = urlParams.get("error");
      if (error) {
        console.error("GitHub auth error:", error);
      }

      // Only check on auth pages
      if (location.pathname !== "/login" && location.pathname !== "/signup") {
        return;
      }

      try {
        // First check Redux store
        if (user) {
          navigate("/");
          return;
        }

        // If not in Redux, check with server
        console.log("Checking authentication with server...");
        const res = await axios.get(`${BASE_URL}/profile/view`, {
          withCredentials: true,
        });

        console.log(
          "Server auth response:",
          res.data ? "Authenticated" : "Not authenticated"
        );

        if (res.data) {
          // User is authenticated, update Redux and redirect
          dispatch(addUser(res.data));
          navigate("/");
        }
      } catch (error) {
        // If error, user is not authenticated, allow auth page access
        console.log("Auth check error:", error);
        console.log("Auth navigation check: not authenticated");
      }
    };

    checkAuthOnNavigation();
  }, [location.pathname, user, navigate, dispatch]);

  return null;
};

function App() {
  return (
    <>
      <Provider store={appStore}>
        <ToastProvider>
          <SocketProvider>
            <BrowserRouter basename="/">
              <Routes>
                <Route path="/" element={<Body />}>
                  <Route path="/" element={<Feed />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/connections" element={<Connections />} />
                  <Route path="/requests" element={<Requests />} />
                </Route>
                {/* Auth routes outside of Body to make them full screen without navbar/footer */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                {/* Chat route outside of Body to make it full screen without navbar/footer */}
                <Route path="/chat/:targetUserId" element={<Chat />} />
                {/* User profile view route */}
                <Route path="/user/:userId" element={<UserProfileView />} />
              </Routes>
              <AuthListener />
            </BrowserRouter>
          </SocketProvider>
        </ToastProvider>
      </Provider>
    </>
  );
}

export default App;
