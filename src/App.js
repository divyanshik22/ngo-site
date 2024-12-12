import "./App.css";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
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
import Ngodetails from "./components/Admin/Ngodetails";
import VolunteerList from "./components/Admin/VolunteerList";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ProtectedRoute = ({ isAuthenticated, children, redirectTo = "/" }) => {
  toast.error("You need to log in to access this page!", {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  });
  return isAuthenticated ? children : <Navigate to={redirectTo} replace />;
};

const App = () => {
  const [token, setToken] = useState(false);
  const [userType, setUserType] = useState("");
  const [username, setUserName] = useState("");
  const dispatch = useDispatch();
  const { isAuthenticated, currentUser } = useSelector((state) => state.user);

  const handleToken = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    setToken(false);
    setUserType("");
    setUserName("");
  };

  useEffect(() => {
    if (isAuthenticated && currentUser && token) {
      setUserName(currentUser.username);
      if (currentUser.email.toLowerCase().includes("admin")) {
        setUserType("admin-token");
      } else if (currentUser.email.toLowerCase().includes("volunteer")) {
        setUserType("volunteer-token");
      } else {
        setUserType("user-token");
      }
    } else {
      setUserType("user-token");
    }
  }, [isAuthenticated, currentUser, token]);

  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          {/* Public Route */}
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

          {/* Protected Routes */}
          <Route
            path="/helpNeeded"
            element={
              <ProtectedRoute isAuthenticated={token}>
                <HelpNeeded
                  token={token}
                  handleToken={handleToken}
                  userType={userType}
                  username={username}
                  handleLogout={handleLogout}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contactus"
            element={
              <ProtectedRoute isAuthenticated={token}>
                <Contactus
                  token={token}
                  handleToken={handleToken}
                  userType={userType}
                  username={username}
                  handleLogout={handleLogout}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feedback"
            element={
              <ProtectedRoute isAuthenticated={token}>
                <Feedback
                  token={token}
                  handleToken={handleToken}
                  userType={userType}
                  username={username}
                  handleLogout={handleLogout}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ngonearby"
            element={
              <ProtectedRoute isAuthenticated={token}>
                <Ngonear
                  token={token}
                  handleToken={handleToken}
                  userType={userType}
                  username={username}
                  handleLogout={handleLogout}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donate"
            element={
              <ProtectedRoute isAuthenticated={token}>
                <Donate
                  token={token}
                  handleToken={handleToken}
                  userType={userType}
                  username={username}
                  handleLogout={handleLogout}
                />
              </ProtectedRoute>
            }
          />
          {/* Admin-Specific Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute
                isAuthenticated={token && userType === "admin-token"}
              >
                <Dashboard
                  token={token}
                  handleToken={handleToken}
                  userType={userType}
                  username={username}
                  handleLogout={handleLogout}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feedbackrequired"
            element={
              <ProtectedRoute
                isAuthenticated={token && userType === "admin-token"}
              >
                <FeedBackRecived
                  token={token}
                  handleToken={handleToken}
                  userType={userType}
                  username={username}
                  handleLogout={handleLogout}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ngodetails"
            element={
              <ProtectedRoute
                isAuthenticated={token && userType === "admin-token"}
              >
                <Ngodetails
                  token={token}
                  handleToken={handleToken}
                  userType={userType}
                  username={username}
                  handleLogout={handleLogout}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/volunteerList"
            element={
              <ProtectedRoute
                isAuthenticated={token && userType === "admin-token"}
              >
                <VolunteerList
                  token={token}
                  handleToken={handleToken}
                  userType={userType}
                  username={username}
                  handleLogout={handleLogout}
                />
              </ProtectedRoute>
            }
          />
          {/* Volunteer-Specific Routes */}
          <Route
            path="/profileVol"
            element={
              <ProtectedRoute
                isAuthenticated={token && userType === "volunteer-token"}
              >
                <Profile
                  token={token}
                  handleToken={handleToken}
                  userType={userType}
                  username={username}
                  handleLogout={handleLogout}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profileAdmin"
            element={
              <ProtectedRoute
                isAuthenticated={token && userType === "admin-token"}
              >
                <ProfileAdmin
                  token={token}
                  handleToken={handleToken}
                  userType={userType}
                  username={username}
                  handleLogout={handleLogout}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/volunteerDashboard"
            element={
              <ProtectedRoute
                isAuthenticated={token && userType === "volunteer-token"}
              >
                <DashboardVolunteer
                  token={token}
                  handleToken={handleToken}
                  userType={userType}
                  username={username}
                  handleLogout={handleLogout}
                />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
