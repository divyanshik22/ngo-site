import React, { useState } from "react";
import { Modal, Form, Button, Row, Col, Container } from "react-bootstrap";
import Navbar from "./NavbarComponent";
import LogIn from "./Login";
import {
  GeoapifyGeocoderAutocomplete,
  GeoapifyContext,
} from "@geoapify/react-geocoder-autocomplete";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";

const Helpneeded = ({ token, handleToken }) => {
  const [helpType, setHelpType] = useState("");
  const [signIn, setSignIn] = useState(true);
  const [showSignup, setShowSignup] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  function onPlaceSelect(value) {
    console.log(value);
  }

  function onSuggectionChange(value) {
    console.log(value);
  }
  const handleClose = () => {
    setShowSignup(false);
  };

  const Signupbtn = () => {
    setSignIn(false);
    setShowSignup(true);
  };

  const onHide = () => {
    setSignIn(false);
  };

  // Fetch location suggestions from Geoapify
  const fetchLocationSuggestions = (query) => {
    if (query.length > 2) {
      const requestOptions = {
        method: "GET",
      };

      fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&apiKey=06018c0b06824a41b9e98e335ba87470`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setLocationSuggestions(result.features);
        })
        .catch((error) => console.log("error", error));
    }
  };

  // Handle input change for location field
  const handleLocationChange = (e) => {
    const query = e.target.value;
    setLocationQuery(query);
    fetchLocationSuggestions(query);
  };

  // Handle when a location suggestion is clicked
  const handleSuggestionClick = (suggestion) => {
    setLocationQuery(suggestion.properties.formatted);
    setLocationSuggestions([]); // Clear suggestions after selection
  };

  return (
    <>
      {!token && (
        <Modal show={signIn} onHide={onHide} centered>
          <Modal.Header closeButton>
            <Modal.Title>Selected </Modal.Title>
          </Modal.Header>
          <Modal.Footer centered>
            <Button variant="info" onClick={onHide}>
              Continue without SignIn
            </Button>
          </Modal.Footer>
          <Modal.Footer>
            <Button variant="info" onClick={Signupbtn}>
              SignIn
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {showSignup && <LogIn show={showSignup} handleClose={handleClose} />}
      <Navbar token={token} handleToken={handleToken} />
      <Container className="mt-4">
        <h2 className="text-center mb-4">Enter the Details</h2>
        <Form>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="formName">
                <Form.Label>Your Name</Form.Label>
                <Form.Control type="text" placeholder="Enter your name" />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formNumber">
                <Form.Label>Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your phone number"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter your email" />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="formProblem">
            <Form.Label>State the Problem</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Describe the problem"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Help needed for</Form.Label>
            <div>
              <Form.Check
                type="radio"
                label="Animal"
                name="helpType"
                value="animal"
                onChange={() => setHelpType("animal")}
                checked={helpType === "animal"}
                inline
              />
              <Form.Check
                type="radio"
                label="People around you"
                name="helpType"
                value="people"
                onChange={() => setHelpType("people")}
                checked={helpType === "people"}
                inline
              />
            </div>
          </Form.Group>

          {helpType === "animal" && (
            <Form.Group className="mb-3" controlId="formAnimal">
              <Form.Label>State the Animal</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter the type of animal"
              />
            </Form.Group>
          )}

          {helpType === "people" && (
            <Form.Group className="mb-3" controlId="formAge">
              <Form.Label>Age</Form.Label>
              <Form.Control type="number" placeholder="Enter the age" />
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Can you select a nearby NGO?</Form.Label>
            <Form.Group controlId="formLocation">
              <Form.Label>Location</Form.Label>
              <GeoapifyContext apiKey="06018c0b06824a41b9e98e335ba87470">
                <GeoapifyGeocoderAutocomplete
                  placeholder="Enter address here"
                  placeSelect={onPlaceSelect}
                  suggestionsChange={onSuggectionChange}
                />
              </GeoapifyContext>
            </Form.Group>
            <Form.Text className="text-muted">
              Not able to select? No problem, we will inform them.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPhoto">
            <Form.Label>Photo</Form.Label>
            <Form.Control type="file" accept="image/*" capture="environment" />
            <Form.Text className="text-muted">
              You can upload a photo or click a new one.
            </Form.Text>
          </Form.Group>

          <Button variant="primary" type="submit" block>
            Submit
          </Button>

          <div className="text-center mt-3">
            <p>Please stay for a while, we will be sending help shortly.</p>
          </div>
        </Form>
      </Container>
    </>
  );
};

export default Helpneeded;
