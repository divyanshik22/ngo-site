import "./App.css";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import HomePage from "./components/HomePage";
import HelpNeeded from "./components/Helpneeded";
import Contactus from "./components/Contactus";
import Feedback from "./components/Feedback";
import Ngonear from "./components/Ngonear";
import Donate from "./components/Donate";
import Dashboard from "./components/Admin/Dashboard";
import FeedBackRecived from "./components/Admin/FeedBackRecived";
import DashboardVolunteer from "./components/Volunteer/Dashboard";
import Profile from "./components/Volunteer/Profile";
import ProfileAdmin from "./components/Admin/Profile";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./components/Redux/userSlice";

const App = () => {
  const [token, setToken] = useState(false);
  const [userType, setUserType] = useState("");
  const [username, setUserName] = useState("");
  const dispatch = useDispatch();
  const { isAuthenticated, error, currentUser } = useSelector(
    (state) => state.user
  );

  const handleToken = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    setToken(false);
    setUserType("");
    setUserName("");
  };

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      console.log("Authenticated User:", currentUser.username, userType);
      setUserName(currentUser.username);

      if (currentUser.email.toLowerCase().includes("admin")) {
        setUserType("admin-token");
      } else if (currentUser.email.toLowerCase().includes("volunteer")) {
        setUserType("volunteer-token");
      } else {
        setUserType("user-token");
      }
    }
  }, [isAuthenticated, currentUser, userType, username]);

  return (
    <Router>
      <Routes>
        {userType === "admin-token" ? (
          <Route
            path="/"
            element={
              <Dashboard
                token={token}
                handleToken={handleToken}
                userType={userType}
                username={username}
                handleLogout={handleLogout}
              />
            }
          />
        ) : userType === "volunteer-token" ? (
          <Route
            path="/"
            element={
              <DashboardVolunteer
                token={token}
                handleToken={handleToken}
                userType={userType}
                username={username}
                handleLogout={handleLogout}
              />
            }
          />
        ) : (
          <Route
            path="/"
            element={
              <HomePage
                token={token}
                handleToken={handleToken}
                userType={userType}
                username={username}
                handleLogout={handleLogout}
              />
            }
          />
        )}
        <Route path="/helpNeeded" element={<HelpNeeded token={token} />} />
        <Route path="/contactus" element={<Contactus token={token} />} />
        <Route path="/feedback" element={<Feedback token={token} />} />
        <Route
          path="/feedbackrequired"
          element={<FeedBackRecived token={token} />}
        />
        <Route path="/ngonearby" element={<Ngonear token={token} />} />
        <Route path="/donate" element={<Donate token={token} />} />
        <Route path="/profileVol" element={<Profile token={token} />} />
        <Route path="/profileAdmin" element={<ProfileAdmin token={token} />} />
      </Routes>
    </Router>
  );
};

export default App;
