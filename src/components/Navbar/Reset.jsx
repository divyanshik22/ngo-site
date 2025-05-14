import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
// import { auth, sendPasswordReset } from "../../firebase";
import { Modal, Form, Button } from "react-bootstrap";
import axios from "../../interceptors/axiosInterceptor";
import "./LoginAndSignUp.css";


const Reset = (props) => {
  const [email, setEmail] = useState("");
  // const [user, loading] = useAuthState(auth);

  // useEffect(() => {
  //   if (loading) return;
  //   // If needed, handle user redirection here
  // }, [user, loading]);

  const handlePasswordReset = async () => {
    if (!email) {
      alert("Please enter your email address.");
      return;
    }
    try {
      const response = await axios.post(`$https://ngo-ri24.onrender.com/api/auth/forgotpassword`, { email });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  return (

    <Modal {...props} centered>
      <Modal.Header closeButton className="custom-body">
        <Modal.Title>Reset Password</Modal.Title>
      </Modal.Header>
      <Modal.Body className="custom-body">
        <Form>
          <Form.Group controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
        </Form>
        <div className="mt-4 d-flex justify-content-around">
        <Button className="custom-button" onClick={props.onHide}>
          Close
        </Button>
        <Button className="custom-button" onClick={handlePasswordReset}>
          Send Reset Email
        </Button>
        </div>
      </Modal.Body>
     
    </Modal>
  );
};

export default Reset;
