import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, sendPasswordReset } from "../firebase";
import { Modal, Form, Button } from "react-bootstrap";

const Reset = (props) => {
  const [email, setEmail] = useState("");
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (loading) return;
    // If needed, handle user redirection here
  }, [user, loading]);

  const handlePasswordReset = () => {
    if (!email) {
      alert("Please enter your email address.");
      return;
    }
    sendPasswordReset(email)
      .then(() => {
        alert("Password reset email sent successfully.");
        props.onHide();
      })
      .catch((error) => {
        console.error("Error sending reset email:", error);
        alert("Failed to send reset email. Please try again.");
      });
  };

  return (
    <Modal {...props} centered>
      <Modal.Header closeButton>
        <Modal.Title>Reset Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handlePasswordReset}>
          Send Reset Email
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Reset;
