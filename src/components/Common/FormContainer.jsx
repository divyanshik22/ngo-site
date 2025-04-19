import React, { useState } from "react";
import Navbar from "./../Navbar/NavbarComponent";
import { Modal, Button, Row, Col, Container } from "react-bootstrap";
import { db } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TopImage from "../../images/BorderAnimal.png";
import "./FormContainer.css";
import Aboutus from "./../About/Aboutus";
import BottomBorder from "../../images/BottomBorder.png";
import axios from "axios";

const FormContainer = ({
  token,
  userType,
  handleToken,
  handleUser,
  username,
  handleLogout,
  children
}) => {

  

  return (
    <>
      {/* {showSignup && <LogIn show={showSignup} handleClose={handleClose} />} */}
      <Navbar
        token={token}
        handleToken={handleToken}
        handleUser={handleUser}
        username={username}
        handleLogout={handleLogout}
      />
      <div style={{ position: "relative",margin:"70px 0px"}}>
      <img src={TopImage} style={{ position: "absolute",top: -75,left: 50 }} />
      <Container  style={{ backgroundColor: "#ffe7d3" , padding:"30px"}}>
        {children}
      </Container>
      <img src={BottomBorder} className="BottomBorder"/>

      </div>
      <Aboutus />
      <ToastContainer />
    </>
  );
};

export default FormContainer;
