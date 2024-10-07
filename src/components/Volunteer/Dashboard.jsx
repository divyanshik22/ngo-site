import React from "react";
import { Carousel, Card, Row, Col, Container } from "react-bootstrap";
import Navbar from "../NavbarComponent";
import Footer from "../Footer";
import Aboutus from "../Aboutus";
import Animal from "../../images/Animal";

const Dashboard = ({ token, userType, handleToken, handleUser }) => {
  return (
    <>
      <Navbar token={token} handleToken={handleToken} handleUser={handleUser} />
      <img
        src={Animal}
        alt="Logo"
        style={{ width: "100%", height: "auto" }}
        className="d-inline-block align-top"
      />
      <Aboutus />
      <Footer />
    </>
  );
};

export default Dashboard;
