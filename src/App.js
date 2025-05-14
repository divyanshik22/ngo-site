import "./App.css";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import HelpNeeded from "./components/Helpneeded";
import Contactus from "./components/Contactus";
import Feedback from "./components/Feedback";
import Ngonear from "./components/Ngonear";
import Donate from "./components/Donate";
import Profile from "./components/Navbar/Profile";
import ProfileAdmin from "./components/Common/ProfileAdmin";
import Ngodetails from "./components/Common/Ngodetails";
import VolunteerList from "./components/Common/VolunteerList";
import HelpRequest from "./components/Common/HelpRequest";
import Contacted from "./components/Common/Contacted";
import FeedbackRecived from "./components/Common/FeedbackRecived";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from './interceptors/axiosInterceptor';

const ProtectedRoute = ({ isAuthenticated, children, redirectTo = "/" }) => {
  console.log(isAuthenticated,"asdfghjkl")
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
      localStorage.removeItem('usertype');
      setUserType("");
      setToken("");
      setUserName("");
    }
  }, [token]);

  const handleToken = (newToken) => {
    console.log(newToken);
    setToken(newToken[0]);
    localStorage.setItem('token',newToken[0]);
    localStorage.setItem('usenamer',newToken[2]);
    localStorage.setItem('userType',newToken[1]);

    setUserType(newToken[1]);
    setUserName(newToken[2]);
  };

  const handleLogout = () => {
    setToken("");
    setUserType("");
    setUserName("");
    localStorage.removeItem("token");
      localStorage.removeItem('usenamer');
      localStorage.removeItem('usertype');

  };

 
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          Public Route
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
            path="/contacted"
            element={
              <ProtectedRoute
                isAuthenticated={localStorage.getItem("token") && localStorage.getItem("userType") === "admin"}
              >
              <Contacted
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
            path="/feebackrecived"
            element={
              <ProtectedRoute
                isAuthenticated={localStorage.getItem("token") && localStorage.getItem("userType") === "admin"}
              >
              <FeedbackRecived
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
                isAuthenticated={localStorage.getItem("token") && localStorage.getItem("userType") === "admin"}
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
                isAuthenticated={localStorage.getItem("token") && localStorage.getItem("userType") === "admin"}
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
          <Route
            path="/helprequestList"
            element={
              <ProtectedRoute
                isAuthenticated={localStorage.getItem("token") && localStorage.getItem("userType") === "admin"}
              >
              <HelpRequest
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
              <ProtectedRoute
                isAuthenticated={!!localStorage.getItem("token")}
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
                isAuthenticated={localStorage.getItem("token") && localStorage.getItem("userType") === "admin"}
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
         
        </Routes>
      </Router>
    </>
  );
};

export default App;
