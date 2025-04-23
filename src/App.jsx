import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./components/Feed";
import ToastProvider from "./context/ToastContext";
import Signup from "./components/Signup";
import Connections from "./components/Connections";
import Requests from "./components/Requests";

function App() {
  return (
    <>
      <Provider store={appStore}>
        <ToastProvider>
          <BrowserRouter basename="/">
            <Routes>
              <Route path="/" element={<Body />}>
                <Route path="/" element={<Feed />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/connections" element={<Connections />} />
                <Route path="/requests" element={<Requests />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </Provider>
    </>
  );
}

export default App;
