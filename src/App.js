import "./App.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import HelpNeeded from "./components/Helpneeded";
import Contactus from "./components/Contactus";
import Feedback from "./components/Feedback";
import Ngonear from "./components/Ngonear";
import Donate from "./components/Donate";
import Dashboard from "./components/Admin/Dashboard";
import DashboardVolunteer from "./components/Volunteer/Dashboard";

const App = () => {
  const [token, setToken] = useState(false);
  const [userType, setUserType] = useState("");

  const handleToken = (newToken) => {
    setToken(newToken);
  };
  const handleUser = (newuserType) => {
    setUserType(newuserType);
    console.log(newuserType);
  };

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
                handleUser={handleUser}
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
                handleUser={handleUser}
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
                handleUser={handleUser}
              />
            }
          />
        )}
        <Route
          path="/helpNeeded"
          element={<HelpNeeded token={token} handleToken={handleToken} />}
        />
        <Route
          path="/contactus"
          element={<Contactus token={token} handleToken={handleToken} />}
        />
        <Route
          path="/feedback"
          element={<Feedback token={token} handleToken={handleToken} />}
        />
        <Route
          path="/ngonearby"
          element={<Ngonear token={token} handleToken={handleToken} />}
        />
        <Route
          path="/donate"
          element={<Donate token={token} handleToken={handleToken} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
