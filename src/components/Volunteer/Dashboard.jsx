import React from "react";
import Navbar from "./NavbarVol";
import Aboutus from ".././Aboutus";
import Animal from "../../images/Animal";

const Dashboard = ({
  token,
  userType,
  handleToken,
  handleUser,
  username,
  handleLogout,
}) => {
  return (
    <>
      <Navbar
        token={token}
        handleToken={handleToken}
        handleUser={handleUser}
        username={username}
        handleLogout={handleLogout}
      />
      <img
        src={Animal}
        alt="Logo"
        style={{ width: "100%", height: "auto" }}
        className="d-inline-block align-top"
      />
      <Aboutus />
    </>
  );
};

export default Dashboard;
