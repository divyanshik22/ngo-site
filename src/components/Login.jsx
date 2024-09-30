import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import Dashboard from "./Admin/Dashboard";

const Login = ({ show, handleClose, handleToken }) => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [dashboard, setDashboard] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    let formIsValid = true;
    let newErrors = { emailOrPhone: "", password: "" };

    // Validate email or phone
    if (!emailOrPhone) {
      newErrors.emailOrPhone = "Email/Phone number is required";
      formIsValid = false;
    } else if (
      !/^\S+@\S+\.\S+$/.test(emailOrPhone) &&
      !/^\d{10}$/.test(emailOrPhone)
    ) {
      newErrors.emailOrPhone = "Invalid email or phone number";
      formIsValid = false;
    }

    // Validate password
    if (!password) {
      newErrors.password = "Password is required";
      formIsValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
      formIsValid = false;
    }

    if (formIsValid) {
      handleToken(true);
      handleClose();

      if (emailOrPhone === "Admin@gmail.com" && password === "123456") {
        console.log("I am in");
        setDashboard(true);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Welcome Back!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="emailOrPhone.ControlInput1">
            <Form.Label>Email/Phone Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Email/Phone number"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              isInvalid={!!errors.emailOrPhone}
            />
            <Form.Control.Feedback type="invalid">
              {errors.emailOrPhone}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="password.ControlInput1">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="text-center">
            <Button variant="info" type="submit">
              Sign In
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Login;
