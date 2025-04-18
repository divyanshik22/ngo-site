import React, { useState } from "react";
import logo from "../images/Logoo.png";
import { Link, useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Login from "./Login";
import Signup from "./Signup";
import "./navbar.css";

const NavbarComponent = ({ token, handleToken, username, handleLogout }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  console.log(localStorage.getItem("token"),username,"Navbar")
  const navigate = useNavigate();

  const handleLogoutBtn = () => {
    handleToken(["" , "" , ""]); // Clear token
    localStorage.removeItem("token");
    handleLogout();
    navigate("/");
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
      <Navbar expand="lg" className="navbar-custom" expanded={isNavExpanded}>
        <Navbar.Brand as={Link} to="/">
          <img
            src={logo}
            alt="Logo"
            width="140"
            height="40"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={() => setIsNavExpanded(!isNavExpanded)}
          className="custom-toggler"
        >
          {isNavExpanded ? (
            <span className="custom-close-icon">&times;</span>
          ) : (
            <span className="custom-hamburger-icon">&#9776;</span>
          )}
        </Navbar.Toggle>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/" className="nav-link">
              Home
            </Nav.Link>

            <Nav.Link as={Link} to="/helpneeded" className="nav-link">
              Help Needed
            </Nav.Link>
            <Nav.Link as={Link} to="/contactus" className="nav-link">
              Contact Us
            </Nav.Link>
            <Nav.Link as={Link} to="/feedback" className="nav-link">
              Feedback
            </Nav.Link>
            <Nav.Link as={Link} to="/donate" className="nav-link">
              Donate
            </Nav.Link>
            <Nav.Link as={Link} to="/ngonearby" className="nav-link">
              NGO Nearby
            </Nav.Link>
          </Nav>
          <Nav>
            {localStorage.getItem("token") ? (
              <Dropdown>
                <Dropdown.Toggle className="btn-custom">
                {localStorage.getItem('usenamer')}
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Item as={Link} to="/profileVol">
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleLogoutBtn}>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Button onClick={Loginbtn} className="btn-custom me-2">
                  Sign In
                </Button>
                <Button onClick={Signupbtn} className="btn-custom">
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
        />
      )}
      {showSignup && <Signup show={showSignup} handleClose={handleClose} />}
    </>
  );
};

export default NavbarComponent;
