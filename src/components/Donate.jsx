import React, { useState } from "react";
import Navbar from "./Navbar/NavbarComponent";
import { Modal, Form, Button, Row, Col, Container } from "react-bootstrap";
import { useEffect } from "react";
import { QRCodeCanvas } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import Aboutus from "./About/Aboutus";

import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaPaw,
  FaHeart,
  FaHome,
  FaStethoscope,
  FaUtensils,
  FaGift,
  FaQrcode,
} from "react-icons/fa";
const Donate = ({
  token,
  userType,
  handleToken,
  handleUser,
  username,
  handleLogout,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize Bootstrap JavaScript
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  const donationOptions = [
    {
      title: "Feed a Pet",
      description: "Provide nutritious meals for rescued animals",
      amount: "$25",
      impact: "Feeds 5 animals for a week",
      icon: <FaUtensils className="text-white" size={24} />,
    },
    {
      title: "Monthly Guardian",
      description: "Become a regular supporter of our shelter",
      amount: "$50/month",
      impact: "Provides ongoing care and medical support",
      icon: <FaPaw className="text-white" size={24} />,
    },
    {
      title: "Custom Support",
      description: "Choose your own contribution amount",
      amount: "Custom",
      impact: "Every amount makes a difference",
      icon: <FaGift className="text-white" size={24} />,
    },
  ];

  const impactStats = [
    { title: "Animals Rescued", value: "5,000+", icon: <FaPaw size={32} /> },
    { title: "Pets Adopted", value: "3,200+", icon: <FaHome size={32} /> },
    {
      title: "Medical Treatments",
      value: "12,000+",
      icon: <FaStethoscope size={32} />,
    },
    { title: "Lives Changed", value: "15,000+", icon: <FaHeart size={32} /> },
  ];
  const [showSignup, setShowSignup] = useState(false);
  const handleClose = () => {
    setShowSignup(false);
  };

  const Signupbtn = () => {
    setShowSignup(true);
  };

  const handleLearnMore = () => {
    navigate('/');
  };

  return (
    <>
      <Navbar
        token={token}
        handleToken={handleToken}
        handleUser={handleUser}
        username={username}
        handleLogout={handleLogout}
      />
      <div style={{ backgroundColor: "#fff" }}>
        {/* Hero Section */}
        <div
          className="position-relative py-5"
          style={{ backgroundColor: "#dc5705" }}
        >
          <div className="container text-white py-5" style={{ backgroundColor: "#dc5705" }}>
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <FaPaw className="display-1 mb-4" />
                <h1 className="display-4 fw-bold mb-4">Help Us Save Lives</h1>
                <p className="lead mb-4">
                  Your donation helps us rescue, rehabilitate, and rehome
                  animals in need. Together, we can create a world where every
                  animal has a loving home.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <button className="btn btn-light btn-lg px-4">
                    Donate Now
                  </button>
                  <button className="btn btn-outline-light btn-lg px-4" onClick={handleLearnMore}>
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Stats */}
        <div
          className="container px-4 position-relative"
          style={{ marginTop: "-3rem" }}
        >
          <div className="row g-4">
            {impactStats.map((stat) => (
              <div key={stat.title} className="col-md-6 col-lg-3">
                <div className="card border-0 shadow-lg h-100 text-center p-4 hover-scale">
                  <div className="card-body">
                    <div
                      className="text-center mb-3"
                      style={{ color: "#dc5705" }}
                    >
                      {stat.icon}
                    </div>
                    <h4 className="card-title h5">{stat.title}</h4>
                    <p
                      className="display-6 fw-bold"
                      style={{ color: "#dc5705" }}
                    >
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Donation Options
        <div className="container py-5">
          <h2 className="text-center display-5 mb-5">Choose Your Impact</h2>
          <div className="row g-4">
            {donationOptions.map((option) => (
              <div key={option.title} className="col-md-4">
                <div className="card h-100 border-0 shadow-lg">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-4">
                      <div
                        className="rounded-circle p-3 me-3"
                        style={{ backgroundColor: "#dc5705" }}
                      >
                        {option.icon}
                      </div>
                      <div>
                        <h3 className="h4 mb-1">{option.title}</h3>
                        <p className="text-muted small mb-0">
                          {option.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-center mb-4">
                      <p
                        className="display-6 fw-bold mb-2"
                        style={{ color: "#dc5705" }}
                      >
                        {option.amount}
                      </p>
                      <p className="text-muted">{option.impact}</p>
                    </div>
                    <button
                      className="btn btn-lg w-100"
                      style={{ backgroundColor: "#dc5705", color: "white" }}
                    >
                      Select
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* QR Code Section */}
        <div className="py-5" style={{ backgroundColor: "#fff8f3" }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="card border-0 shadow-lg">
                  <div className="card-body text-center p-5">
                    <FaPaw
                      className="display-1 mb-4"
                      style={{ color: "#dc5705" }}
                    />
                    <h3 className="h2 mb-4" style={{ color: "#dc5705" }}>
                      Quick Donation
                    </h3>
                    <p className="text-muted mb-4">
                      Scan to make an instant contribution
                    </p>
                    <div className="position-relative d-inline-block">
                      <div
                        className="p-4 border-2 rounded"
                        style={{ borderColor: "#dc5705" }}
                      >


                        <QRCodeCanvas
                          value="https://your-link-or-text.com"
                          size={200}
                          fgColor="#dc5705"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Aboutus />

        <style>
          {`
          .hover-scale {
            transition: transform 0.3s ease;
          }
          .hover-scale:hover {
            transform: scale(1.05);
          }
          .card {
            transition: all 0.3s ease;
          }
          .card:hover {
            transform: translateY(-5px);
          }
        `}
        </style>
      </div>
    </>
  );
};
export default Donate;
