import React from "react";
import Navbar from "./NavbarAdmin";
import Aboutus from "../Aboutus";
import Animal from "../../images/Animal";

const Dashboard = ({
  token,
  userType,
  handleToken,
  username,
  handleLogout,
}) => {
  console.log(token);
  return (
    <>
      <Navbar
        token={token}
        handleToken={handleToken}
        username={username}
        userType={userType}
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
