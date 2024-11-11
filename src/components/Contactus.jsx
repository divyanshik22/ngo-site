import React, { useState } from "react";
import Navbar from "./NavbarComponent";
import LogIn from "./Login";
import { Modal, Form, Button, Row, Col, Container } from "react-bootstrap";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contactus = ({ token, handleToken }) => {
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

  const handleClose = () => {
    setShowSignup(false);
  };

  const Signupbtn = () => {
    setShowSignup(true);
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
        name: name,
        email: email,
        phone: phone,
        message: message,
      });
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <>
      {showSignup && <LogIn show={showSignup} handleClose={handleClose} />}
      <Navbar token={token} handleToken={handleToken} />

      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <h2>Contact Us</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formEmail" className="mt-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formPhone" className="mt-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  isInvalid={!!errors.phone}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phone}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formMessage" className="mt-3">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Enter your message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  isInvalid={!!errors.message}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-4">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
      <ToastContainer />
    </>
  );
};

export default Contactus;
