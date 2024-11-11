import React, { useState } from "react";
import logo from "../images/Logoo.png";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Login from "./Login";
import Signup from "./Signup";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./navbar.css";

const NavbarComponent = ({ token, handleToken, handleUser }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [username, setUsername] = useState("");

  const navigate = useNavigate(); // Initialize navigate
  const userLoggedIn = (name) => {
    console.log("Innnnnn");
    setUsername(name);
  };

  const handleProfile = () => {
    handleToken(false);
    // navigate("/");
  };
  const handleClose = () => {
    setShowLogin(false);
    setShowSignup(false);
  };

  const Loginbtn = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  const Signupbtn = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  return (
    <>
      <Navbar
        collapseOnSelect
        expand="lg"
        style={{ backgroundColor: "#0f6465", color: "white" }}
      >
        <Navbar.Brand as={Link} to="/">
          <img
            src={logo}
            alt="Logo"
            width="140"
            height="40"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link
              as={Link}
              to="/"
              className="ms-3"
              style={{ color: "white" }}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/helpneeded"
              className="ms-3"
              style={{ color: "white" }}
            >
              Help Needed
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/contactus"
              className="ms-3"
              style={{ color: "white" }}
            >
              Contact Us
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/feedback"
              className="ms-3"
              style={{ color: "white" }}
            >
              Feedback
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/donate"
              className="ms-3"
              style={{ color: "white" }}
            >
              Donate
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/ngonearby"
              className="ms-3"
              style={{ color: "white" }}
            >
              NGO Nearby
            </Nav.Link>
          </Nav>
          <Nav>
            {token ? (
              <Button
                onClick={handleProfile}
                style={{
                  backgroundColor: "white",
                  color: "#0f6465",
                  border: "none",
                }}
              >
                {username}
              </Button>
            ) : (
              <>
                <Button
                  variant="info"
                  onClick={Loginbtn}
                  className="me-1"
                  style={{
                    backgroundColor: "white",
                    color: "#0f6465",
                    border: "none",
                  }}
                >
                  SignIn
                </Button>
                <Button
                  variant="info"
                  onClick={Signupbtn}
                  style={{
                    backgroundColor: "white",
                    color: "#0f6465",
                    border: "none",
                  }}
                >
                  Signup
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      {showLogin && (
        <Login
          show={showLogin}
          handleClose={handleClose}
          handleToken={handleToken}
          handleUser={handleUser}
          userLoggedIn={userLoggedIn}
        />
      )}
      {showSignup && <Signup show={showSignup} handleClose={handleClose} />}
    </>
  );
};

export default NavbarComponent;
