import React from "react";
import logo from "../images/Logoo.png"; // Update path to your logo
import "./Aboutus.css";

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
              <a href="/" className="nav-link p-0">
                Home
              </a>
            </li>
            <li className="nav-item mb-2">
              <a href="/helpneeded" className="nav-link p-0">
                Help Needed
              </a>
            </li>
            <li className="nav-item mb-2">
              <a href="/contactus" className="nav-link p-0">
                Contact Us
              </a>
            </li>
            <li className="nav-item mb-2">
              <a href="/feedback" className="nav-link p-0">
                Feedback
              </a>
            </li>
            <li className="nav-item mb-2">
              <a href="/donate" className="nav-link p-0">
                Donate
              </a>
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
          <form>
            <h6>Subscribe to Our Newsletter</h6>
            <div className="d-flex flex-column flex-sm-row w-100 gap-2">
              <input
                type="email"
                className="form-control"
                placeholder="Email address"
              />
              <button className="btn btn-primary" type="button">
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Aboutus;
