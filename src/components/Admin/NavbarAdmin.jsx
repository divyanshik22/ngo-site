import React, { useState } from "react";
import logo from "../../images/Logoo.png";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Login from "../Login";
import Signup from "../Signup";
import "./navbaradmin.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const NavbarAdmin = ({ token, handleToken, handleUser }) => {
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
    // navigate("/"); // Uncomment to navigate to homepage
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
      <Navbar collapseOnSelect expand="lg" className="navbar-custom">
        <Navbar.Brand as={Link} to="/">
          <img
            src={logo}
            alt="Logo"
            width="120"
            height="40"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/" className="nav-link ms-3">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/helpneeded" className="nav-link ms-3">
              Help Required
            </Nav.Link>
            <Nav.Link as={Link} to="/contactus" className="nav-link ms-3">
              Contacted
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/feedbackrequired"
              className="nav-link ms-3"
            >
              Feedback Received
            </Nav.Link>
            <Nav.Link as={Link} to="/donate" className="nav-link ms-3">
              Item Donated
            </Nav.Link>
            <Nav.Link as={Link} to="/ngonearby" className="nav-link ms-3">
              NGO Nearby
            </Nav.Link>
          </Nav>
          <Nav>
            {token ? (
              <Button onClick={handleProfile} className="btn-custom">
                {username}
              </Button>
            ) : (
              <>
                <Button
                  variant="info"
                  onClick={Loginbtn}
                  className="btn-custom me-1"
                >
                  SignIn
                </Button>
                <Button
                  variant="info"
                  onClick={Signupbtn}
                  className="btn-custom"
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

export default NavbarAdmin;
