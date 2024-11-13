import React, { useState } from "react";
import logo from "../../images/Logoo.png";
import { Link, useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Login from "../Login";
import Signup from "../Signup";
import "./navbarvol.css";

const NavbarVol = ({ token, handleToken, username, handleLogout }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const navigate = useNavigate();

  const handleLogoutBtn = () => {
    handleToken(false); // Clear token
    handleLogout();
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
              <Dropdown>
                <Dropdown.Toggle className="btn-custom">
                  {username}
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Item as={Link} to="/profileVol">
                    Profile Vol
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleLogoutBtn}>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Button
                  variant="info"
                  onClick={Loginbtn}
                  className="btn-custom me-1"
                >
                  Sign In
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
        />
      )}
      {showSignup && <Signup show={showSignup} handleClose={handleClose} />}
    </>
  );
};

export default NavbarVol;
