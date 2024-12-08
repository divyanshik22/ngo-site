import React from "react";
import logo from "../images/Logoo.png"; // Update path to your logo
import "./Aboutus.css";
import { Link, useNavigate } from "react-router-dom";

const Aboutus = () => {
  return (
    <div
      className="container-fluid"
      style={{
        backgroundColor: "#0F6465",
        color: "white",
        padding: "3rem 1rem",
      }}
    >
      <div className="row">
        {/* Left Section: Logo and Description */}
        <div className="col-md-4 d-flex flex-column align-items-start">
          <img
            src={logo}
            alt="Company Logo"
            className="img-fluid mb-3"
            style={{ width: "150px", height: "auto" }}
          />
          <p>
            We are committed to making a difference in the community by
            providing resources and support for those in need. Join us in our
            mission to create a better tomorrow.
          </p>
        </div>

        {/* Half-line Divider */}
        <div className="col-md-1">
          <div className="vertical-divider" />
        </div>

        {/* Center Section: Quick Links */}
        <div className="col-md-3">
          <h5>Quick Links</h5>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <Link to="/" className="nav-link p-0">
                Home
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/helpneeded" className="nav-link p-0">
                Help Needed
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/contactus" className="nav-link p-0">
                Contact Us
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/feedback" className="nav-link p-0">
                Feedback
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/donate" className="nav-link p-0">
                Donate
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Section: Contact Information */}
        <div className="col-md-4">
          <h5>Contact Us</h5>
          <ul className="list-unstyled">
            <li>Email: support@company.com</li>
            <li>Phone: +1 (123) 456-7890</li>
            <li>Address: 123 Main Street, City, Country</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Aboutus;
