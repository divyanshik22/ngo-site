import React, { useState, useEffect } from "react";
import Navbar from "./NavbarComponent";
import LogIn from "./Login";
import { Modal, Form, Button, Row, Col, Container } from "react-bootstrap";
import { FaStar } from "react-icons/fa"; // Install react-icons : npm install react-icons
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Feedback = ({ token, handleToken }) => {
  const [showSignup, setShowSignup] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0); // rating is a number from 1 to 5
  const [feedback, setFeedback] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    rating: "",
    feedback: "",
  });
  const [userDetails, setUserDetails] = useState(null);

  const handleClose = () => {
    setShowSignup(false);
  };

  const Signupbtn = () => {
    setShowSignup(true);
  };

  const handleStarClick = (value) => {
    setRating(value);
  };

  const validateName = () => {
    if (!name) {
      setErrors((prev) => ({ ...prev, name: "Name is required" }));
      return false;
    } else {
      setErrors((prev) => ({ ...prev, name: "" }));
      return true;
    }
  };

  const validateEmail = () => {
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      return false;
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
      return true;
    }
  };

  const validateRating = () => {
    if (rating === 0) {
      setErrors((prev) => ({ ...prev, rating: "Rating is required" }));
      return false;
    } else {
      setErrors((prev) => ({ ...prev, rating: "" }));
      return true;
    }
  };

  const validateFeedback = () => {
    if (!feedback) {
      setErrors((prev) => ({ ...prev, feedback: "Feedback is required" }));
      return false;
    } else {
      setErrors((prev) => ({ ...prev, feedback: "" }));
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isRatingValid = validateRating();
    const isFeedbackValid = validateFeedback();

    if (isNameValid && isEmailValid && isRatingValid && isFeedbackValid) {
      toast.success("Thank you for the feedback", {
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
      setRating("");
      setFeedback("");
      await addDoc(collection(db, "Feedback"), {
        name: name,
        email: email,
        rating: rating,
        feedback: feedback,
      });
      // Implement form submission logic here
    }
  };

  return (
    <>
      {showSignup && <LogIn show={showSignup} handleClose={handleClose} />}
      <Navbar token={token} handleToken={handleToken} />

      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <h2>Feedback Form</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={validateName} // Trigger validation when the user leaves the field
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
                  onBlur={validateEmail} // Trigger validation onBlur
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formRating" className="mt-3">
                <Form.Label>Rating (1-5 Stars)</Form.Label>
                <div>
                  {[1, 2, 3, 4, 5].map((starValue) => (
                    <FaStar
                      key={starValue}
                      size={30}
                      color={starValue <= rating ? "#ffc107" : "#e4e5e9"}
                      onClick={() => handleStarClick(starValue)}
                      style={{ cursor: "pointer", marginRight: 5 }}
                    />
                  ))}
                </div>
                {errors.rating && (
                  <div className="text-danger">{errors.rating}</div>
                )}
              </Form.Group>

              <Form.Group controlId="formFeedback" className="mt-3">
                <Form.Label>Feedback</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Enter your feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  onBlur={validateFeedback} // Trigger validation onBlur
                  isInvalid={!!errors.feedback}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.feedback}
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

export default Feedback;
