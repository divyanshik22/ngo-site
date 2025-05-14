import React, { useState } from "react";
import Navbar from "./Navbar/NavbarComponent";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { FaStar } from "react-icons/fa"; // Install react-icons : npm install react-icons
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TopImage from "../images/BorderAnimal.png";
import "./common.css";
import Aboutus from "./About/Aboutus";
import BottomBorder from "../images/BottomBorder.png";
import axios from "../interceptors/axiosInterceptor";
import FormContainer from "./Common/FormContainer";

const Feedback = ({
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
  const [rating, setRating] = useState(0); // rating is a number from 1 to 5
  const [feedback, setFeedback] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    rating: "",
    feedback: "",
  });

  const handleClose = () => setShowSignup(false);

  const handleStarClick = (value) => setRating(value);

  // Validation functions
  const validateName = () => (name ? "" : "Name is required");
  const validateEmail = () => {
    if (!email) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Invalid email format";
    return "";
  };
  const validateRating = () => (rating === 0 ? "Rating is required" : "");
  const validateFeedback = () => (feedback ? "" : "Feedback is required");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    const nameError = validateName();
    const emailError = validateEmail();
    const ratingError = validateRating();
    const feedbackError = validateFeedback();

    // Update errors and check if form is valid
    setErrors({
      name: nameError,
      email: emailError,
      rating: ratingError,
      feedback: feedbackError,
    });

    if (!nameError && !emailError && !ratingError && !feedbackError) {
      const response = await axios.post(`https://ngo-ri24.onrender.com/api/feedback`, {
        name: name,
        email: email,
        rating: rating,
        feedback: feedback
      });
      console.log(response.data);
      try {
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
        setRating(0);
        setFeedback("");
        await addDoc(collection(db, "Feedback"), {
          name,
          email,
          rating,
          feedback,
        });
      } catch (error) {
        toast.error("An error occurred while submitting the feedback", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    }
  };

  return (
    <>
      <FormContainer
        token={token}
        handleToken={handleToken}
        userType={userType}
        username={username}
        handleLogout={handleLogout}>
        <Row className="justify-content-center">
          <Col md={6}>
            <h2 style={{ color: '#0F6465', textAlign: "center" }}>Feedback Form</h2>
            <Form onSubmit={handleSubmit}>
              {/* Name Field */}
              <Form.Group controlId="formName">
                <Form.Label style={{ color: '#0F6465' }}>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  isInvalid={!!errors.name}
                  className="custom-input"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Email Field */}
              <Form.Group controlId="formEmail" className="mt-3">
                <Form.Label style={{ color: '#0F6465' }}>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isInvalid={!!errors.email}
                  className="custom-input"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Rating Field */}
              <Form.Group controlId="formRating" className="mt-3">
                <Form.Label style={{ color: '#0F6465' }}>Rating (1-5 Stars)</Form.Label>
                <div>
                  {[1, 2, 3, 4, 5].map((starValue) => (
                    <FaStar
                      key={starValue}
                      size={30}
                      color={starValue <= rating ? "#ffc107" : "#e4e5e9"}
                      onClick={() => handleStarClick(starValue)}
                      style={{ cursor: "pointer", marginRight: 5, backgroundColor: '#ffe7d3' }}
                    />
                  ))}
                </div>
                {errors.rating && (
                  <div className="text-danger">{errors.rating}</div>
                )}
              </Form.Group>

              {/* Feedback Field */}
              <Form.Group controlId="formFeedback" className="mt-3">
                <Form.Label style={{ color: '#0F6465' }}>Feedback</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Enter your feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  isInvalid={!!errors.feedback}
                  className="custom-input"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.feedback}
                </Form.Control.Feedback>
              </Form.Group>

              <Button className="mt-4 custom-button" type="submit" >
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </FormContainer>
    </>
  );
};

export default Feedback;
