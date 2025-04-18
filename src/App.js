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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ProtectedRoute = ({ isAuthenticated, children, redirectTo = "/" }) => {
  if (!isAuthenticated) {
    toast.error("You need to log in to access this page!", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};


const App = () => {
  const [token, setToken] = useState("");
  const [userType, setUserType] = useState("");
  const [username, setUserName] = useState("");
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      localStorage.removeItem("token");
      localStorage.removeItem('usenamer');
      setToken("");
      setUserName("");
    }
  }, [token]);

  const handleToken = (newToken) => {
    console.log(newToken);
    setToken(newToken[0]);
    localStorage.setItem('token',newToken[0]);
    localStorage.setItem('usenamer',newToken[2]);
    setUserType(newToken[1]);
    setUserName(newToken[2]);
  };

  const handleLogout = () => {
    setToken("");
    setUserType("");
    setUserName("");
    localStorage.removeItem("token");
  };

 
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          Public Route
          {(userType === "user" || userType === "") ? (
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
          ) : userType === "volunteer" ? (
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
          ) :  userType === "admin" ? (
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
           
          ): null}
          Protected Routes
          <Route
            path="/helpNeeded"
            element={
              // <ProtectedRoute isAuthenticated={!!token}>
              <HelpNeeded
                token={token}
                handleToken={handleToken}
                userType={userType}
                username={username}
                handleLogout={handleLogout}
              />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/contactus"
            element={
              // <ProtectedRoute isAuthenticated={!!token}>
              <Contactus
                token={token}
                handleToken={handleToken}
                userType={userType}
                username={username}
                handleLogout={handleLogout}
              />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/feedback"
            element={
              // <ProtectedRoute isAuthenticated={!!token}>
              <Feedback
                token={token}
                handleToken={handleToken}
                userType={userType}
                username={username}
                handleLogout={handleLogout}
              />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/ngonearby"
            element={
              // <ProtectedRoute isAuthenticated={!!token}>
              <Ngonear
                token={token}
                handleToken={handleToken}
                userType={userType}
                username={username}
                handleLogout={handleLogout}
              />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/donate"
            element={
              // <ProtectedRoute isAuthenticated={!!token}>
              <Donate
                token={token}
                handleToken={handleToken}
                userType={userType}
                username={username}
                handleLogout={handleLogout}
              />
              // </ProtectedRoute> 
            }
          />
          Admin-Specific Routes
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
          Volunteer-Specific Routes
          <Route
            path="/profileVol"
            element={
              // <ProtectedRoute
              //   isAuthenticated={token && userType === "volunteer-token"}
              // >
              <Profile
                token={token}
                handleToken={handleToken}
                userType={userType}
                username={username}
                handleLogout={handleLogout}
              />
              //  </ProtectedRoute>
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
