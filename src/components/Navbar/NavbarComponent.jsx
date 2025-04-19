import React, { useState } from "react";
import logo from "../../images/Logoo.png";
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
  const navigate = useNavigate();

  const handleLogoutBtn = () => {
    handleToken(["", "", ""]); // Clear token
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
         {(() => {
      const userType = localStorage.getItem('userType') || '';
      console.log(typeof(userType))
      const commonLinks = [
        { to: '/', label: 'Home' },
      ];

      const userLinks = [
        { to: '/helpneeded', label: 'Help Needed' },
        { to: '/contactus', label: 'Contact Us' },
        { to: '/feedback', label: 'Feedback' },
        { to: '/donate', label: 'Donate' },
        { to: '/ngonearby', label: 'NGO Nearby' },
      ];

      const adminVolunteerLinks = [
        { to: '/helpneeded', label: 'Help Required' },
        { to: '/helpneeded', label: 'Contacted' },
        { to: '/volunteerList', label: 'Volunteers' },
        { to: '/feedbackrequired', label: 'Feedback Received' },
        { to: '/donate', label: 'Item Donated' },
        { to: '/ngodetails', label: 'Ngo Details' },
      ];

      const linksToRender = [
        ...commonLinks,
        ...(userType === 'admin' || userType === 'volunteer' ? adminVolunteerLinks : userLinks),
      ];

      return linksToRender.map(({ to, label }) => (
        <Nav.Link key={to} as={Link} to={to} className="nav-link ms-3">
          {label}
        </Nav.Link>
      ));
    })()}
  </Nav>
  <Nav className="me-1">
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
                  Sign Up
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
      {showSignup && <Signup show={showSignup} handleClose={handleClose} handleToken={handleToken} />}
    </>
  );
};

export default NavbarComponent;
