import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginAndSignUp.css";
import axios from "axios";

const Signup = ({ show, handleClose }) => {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkboxValue, setCheckboxValue] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    phone: "",
    email: "",
    password: "",
    checkbox: "",
  });
  const [responseError,setResponseError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formIsValid = true;
    let newErrors = {
      username: "",
      phone: "",
      email: "",
      password: "",
      checkbox: "",
    };

    if (!username) {
      newErrors.username = "Username is required";
      formIsValid = false;
    }

    if (!phone) {
      newErrors.phone = "Phone number is required";
      formIsValid = false;
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = "Invalid phone number (must be 10 digits)";
      formIsValid = false;
    }

    if (!email) {
      newErrors.email = "Email is required";
      formIsValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Invalid email format";
      formIsValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      formIsValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
      formIsValid = false;
    }

    if (!checkboxValue) {
      newErrors.checkbox = "Please select User or Volunteer";
      formIsValid = false;
    }

    if (formIsValid) {
      try {
        const response = await axios.post(`https://ngo-ri24.onrender.com/api/auth/register`, {
          name: username,
          email: email,
          password: password,
          role: checkboxValue,
          phone: phone,
        });
        console.log(response.data);
        toast.success("Thank you for registering with us!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        handleClose();
      } catch (error) {
        setResponseError(error.response.data.error);
        toast.error("Sign up Falied " + responseError, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        setUsername("");
        setPhone("");
        setEmail("");
        setPassword("");
        setCheckboxValue("");
      }
      // handleClose();
    } else {
      setErrors(newErrors);
    }
  };

  const handleInputChange = (field, value) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));

    switch (field) {
      case "username":
        setUsername(value);
        break;
      case "phone":
        setPhone(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "checkbox":
        setCheckboxValue(value);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="custom-body">
          <Modal.Title>Welcome to Utsaah Help the Needy</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className={`form-control ${errors.username ? "is-invalid" : ""
                  } custom-input `}
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => handleInputChange("username", e.target.value)}

              />
              {errors.username && (
                <div className="invalid-feedback">{errors.username}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Phone Number
              </label>
              <input
                type="text"
                className={`form-control ${errors.phone ? "is-invalid" : ""} custom-input`}
                id="phone"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}

              />
              {errors.phone && (
                <div className="invalid-feedback">{errors.phone}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Sign Up As</label>
              <div className="d-flex gap-3">
                <input
                  type="radio"
                  id="user"
                  name="signupType"
                  value="user"
                  checked={checkboxValue === "user"}
                  onChange={(e) => handleInputChange("checkbox", e.target.value)}
                  className="d-none"
                />
                <label
                  htmlFor="user"
                  className={`radio-label ${checkboxValue === "user" ? "selected" : ""}`}
                >
                  User
                </label>

                <input
                  type="radio"
                  id="volunteer"
                  name="signupType"
                  value="volunteer"
                  checked={checkboxValue === "volunteer"}
                  onChange={(e) => handleInputChange("checkbox", e.target.value)}
                  className="d-none"
                />
                <label
                  htmlFor="volunteer"
                  className={`radio-label ${checkboxValue === "volunteer" ? "selected" : ""}`}
                >
                  Volunteer
                </label>
              </div>

              {errors.checkbox && (
                <div className="text-danger mt-2">{errors.checkbox}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""} custom-input`}
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => handleInputChange("email", e.target.value)}

              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className={`form-control ${errors.password ? "is-invalid" : ""
                  } custom-input`}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => handleInputChange("password", e.target.value)}

              />
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>

            <div className="text-center">
              <Button type="submit" className="custom-button">
                Register
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default Signup;
