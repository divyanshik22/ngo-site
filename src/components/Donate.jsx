import React, { useState } from "react";
import Navbar from "./NavbarComponent";
import LogIn from "./Login";
import { Modal, Form, Button, Row, Col, Container } from "react-bootstrap";
const Donate = ({ token, handleToken }) => {
  const [showSignup, setShowSignup] = useState(false);
  const handleClose = () => {
    setShowSignup(false);
  };

  const Signupbtn = () => {
    setShowSignup(true);
  };

  return (
    <>
      {showSignup && <LogIn show={showSignup} handleClose={handleClose} />}
      <Navbar token={token} handleToken={handleToken} />
    </>
  );
};
export default Donate;
