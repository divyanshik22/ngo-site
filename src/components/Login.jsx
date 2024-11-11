import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./Redux/userSlice";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
const Login = ({
  show,
  handleClose,
  handleToken,
  handleUser,
  userLoggedIn,
}) => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [userLogged, setUserLogged] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    emailOrPhone: "",
    password: "",
  });

  const dispatch = useDispatch();
  const { isAuthenticated, error, currentUser } = useSelector(
    (state) => state.user
  );

  const handleSubmit = async (e) => {
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
      dispatch(login({ emailOrPhone, password }));
      try {
        await signInWithEmailAndPassword(auth, emailOrPhone, password);
        console.log("User logged in Successfully");
      } catch (error) {
        console.log(error.message);
      }
    } else {
      setErrors(newErrors);
    }
  };

  // Monitor authentication state changes with useEffect
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      console.log("Authenticated User:", currentUser.username); // Logs username
      handleToken(true);
      handleClose();
      setUserLogged(currentUser.username);
      userLoggedIn(currentUser.username);
      console.log(userLoggedIn);

      if (currentUser.email.toLowerCase().includes("admin")) {
        handleUser("admin-token");
      } else if (currentUser.email.toLowerCase().includes("volunteer")) {
        handleUser("volunteer-token");
      } else {
        handleUser("user-token");
      }
    }
  }, [
    isAuthenticated,
    currentUser,
    handleToken,
    handleClose,
    handleUser,
    setUserLogged,
    userLoggedIn,
  ]);

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
          {error && <div className="text-danger mb-3">{error}</div>}
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
