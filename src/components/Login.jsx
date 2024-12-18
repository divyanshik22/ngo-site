import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { signInWithEmailAndPassword } from "firebase/auth";
import { login } from "./Redux/userSlice";
import { auth } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Reset from "./Reset";

const Login = ({ show, handleClose, handleToken }) => {
  const [resetmodalShow, setResetModalShow] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    emailOrPhone: "",
    password: "",
    authError: "", // Added to show authentication error
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, error, currentUser } = useSelector(
    (state) => state.user
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    let formIsValid = true;
    let newErrors = { emailOrPhone: "", password: "", authError: "" };

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
      try {
        dispatch(login({ emailOrPhone, password }));
        toast.success("Logged In", {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        const userCredential = await signInWithEmailAndPassword(
          auth,
          emailOrPhone,
          password
        );
        handleToken(true);
        handleClose();
        navigate("/");
        console.log("User logged in successfully");
      } catch (error) {
        console.error("Error logging in:", error.message);
        toast.error("Username or password does not match", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        // Update errors with authError if login fails
        newErrors.authError = "Username or password does not match";
      }
    }
    setErrors(newErrors);
  };
  const handleInputChange = (field, value) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));

    switch (field) {
      case "email":
        setEmailOrPhone(value);
        break;
      case "password":
        setPassword(value);
        break;

      default:
        break;
    }
  };

  // useEffect(() => {
  //   console.log(isAuthenticated, currentUser);
  //   if (isAuthenticated && currentUser) {
  //     console.log("in");
  //     handleToken(true);
  //     handleClose();
  //   }
  // }, [isAuthenticated, currentUser, handleToken, handleClose]);
  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Welcome Back!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="emailOrPhone.ControlInput1">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Email"
                value={emailOrPhone}
                onChange={(e) => handleInputChange("email", e.target.value)}
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
                onChange={(e) => handleInputChange("password", e.target.value)}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Show Firebase authentication error */}
            {errors.authError && (
              <div className="text-danger mb-3">{errors.authError}</div>
            )}

            <div className="text-center">
              <Button
                variant="info"
                type="submit"
                onClick={() => setResetModalShow(true)}
              >
                Forgot Password?
              </Button>
              <Button variant="info" type="submit">
                Sign In
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <Reset show={resetmodalShow} onHide={() => setResetModalShow(false)} />
      <ToastContainer />
    </>
  );
};

export default Login;
