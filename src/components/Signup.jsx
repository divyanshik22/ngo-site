import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        toast.success("Thank you for registering with us!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        await createUserWithEmailAndPassword(auth, email, password);
        const user = auth.currentUser;
        if (user) {
          await setDoc(doc(db, "Users", user.uid), {
            email: user.email,
            username,
            phone,
            checkboxValue,
            ...(checkboxValue === "Volunteer" ? { active: true } : {}),
          });
        }
      } catch (error) {
        console.log(error.message);
        toast.error("An error occurred while registering", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
      handleClose();
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
        <Modal.Header closeButton>
          <Modal.Title>Welcome to Utsaah Help the Needy</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className={`form-control ${
                  errors.username ? "is-invalid" : ""
                }`}
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
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
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
              <div>
                <input
                  type="radio"
                  id="user"
                  name="signupType"
                  value="User"
                  checked={checkboxValue === "User"}
                  onChange={(e) =>
                    handleInputChange("checkbox", e.target.value)
                  }
                />
                <label htmlFor="user" className="ms-2 me-3">
                  User
                </label>

                <input
                  type="radio"
                  id="volunteer"
                  name="signupType"
                  value="Volunteer"
                  checked={checkboxValue === "Volunteer"}
                  onChange={(e) =>
                    handleInputChange("checkbox", e.target.value)
                  }
                />
                <label htmlFor="volunteer" className="ms-2">
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
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
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
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                }`}
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
              <Button variant="info" type="submit">
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
