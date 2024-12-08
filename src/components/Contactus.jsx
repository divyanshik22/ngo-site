import React, { useState } from "react";
import Navbar from "./NavbarComponent";
import LogIn from "./Login";
import { Modal, Button, Row, Col, Container } from "react-bootstrap";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contactus = ({
  token,
  userType,
  handleToken,
  handleUser,
  username,
  handleLogout,
}) => {
  const [showSignup, setShowSignup] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleClose = () => setShowSignup(false);
  const Signupbtn = () => setShowSignup(true);

  const handleInputChange = (field, value) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));

    switch (field) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "phone":
        setPhone(value);
        break;
      case "message":
        setMessage(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formIsValid = true;
    let newErrors = { name: "", email: "", phone: "", message: "" };

    // Validate name
    if (!name) {
      newErrors.name = "Name is required";
      formIsValid = false;
    }

    // Validate email
    if (!email) {
      newErrors.email = "Email is required";
      formIsValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
      formIsValid = false;
    }

    // Validate phone
    if (!phone) {
      newErrors.phone = "Phone number is required";
      formIsValid = false;
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = "Invalid 10-digit phone number";
      formIsValid = false;
    }

    // Validate message
    if (!message) {
      newErrors.message = "Message is required";
      formIsValid = false;
    }

    if (formIsValid) {
      toast.success("Thank you for contacting us", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");

      await addDoc(collection(db, "ContactUs"), {
        name,
        email,
        phone,
        message,
      });
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <>
      {showSignup && <LogIn show={showSignup} handleClose={handleClose} />}
      <Navbar
        token={token}
        handleToken={handleToken}
        handleUser={handleUser}
        username={username}
        handleLogout={handleLogout}
      />

      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <h2>Contact Us</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="phone" className="form-label">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
                {errors.phone && (
                  <div className="invalid-feedback">{errors.phone}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  Message
                </label>
                <textarea
                  id="message"
                  className={`form-control ${
                    errors.message ? "is-invalid" : ""
                  }`}
                  rows="4"
                  placeholder="Enter your message"
                  value={message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                />
                {errors.message && (
                  <div className="invalid-feedback">{errors.message}</div>
                )}
              </div>

              <Button variant="primary" type="submit" className="mt-4">
                Submit
              </Button>
            </form>
          </Col>
        </Row>
      </Container>
      <ToastContainer />
    </>
  );
};

export default Contactus;
