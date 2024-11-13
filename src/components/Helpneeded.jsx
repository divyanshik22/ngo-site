import React, { useState, useRef, useEffect } from "react";
import { Modal, Form, Button, Row, Col, Container } from "react-bootstrap";
import Navbar from "./NavbarComponent";
import LogIn from "./Login";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const Helpneeded = ({ token, handleToken }) => {
  const [helpType, setHelpType] = useState("");
  const [signIn, setSignIn] = useState(true);
  const [showSignup, setShowSignup] = useState(false);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [tracking, setTracking] = useState(false);
  const [volunteerLocation, setVolunteerLocation] = useState({
    lat: 28.65,
    lng: 77.22,
  });
  const mapRef = useRef();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userLocation = { lat: latitude, lng: longitude };
          setLocation(userLocation);
          getAddress(latitude, longitude);
          mapRef.current?.setView(userLocation, 15);
        },
        (error) => {
          console.error("Geolocation error:", error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const LocationMap = () => {
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setLocation({ lat, lng });
        getAddress(lat, lng);
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    return location ? (
      <Marker position={location}>
        <Popup>{address}</Popup>
      </Marker>
    ) : null;
  };

  const getAddress = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      setAddress(response.data.display_name);
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  L.Marker.prototype.options.icon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

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

  const handleSubmit = () => {
    if (location) {
      console.log("Latitude:", location.lat);
      console.log("Longitude:", location.lng);
      alert(`Location: ${address}`);
      setTracking(true); // Start tracking and display the volunteer tracking map
    } else {
      alert("Please select a location.");
    }
  };

  // Animation effect to move volunteer marker to user's selected location
  useEffect(() => {
    if (tracking && volunteerLocation && location) {
      const interval = setInterval(() => {
        setVolunteerLocation((prevLocation) => {
          const latDiff = (location.lat - prevLocation.lat) * 0.05;
          const lngDiff = (location.lng - prevLocation.lng) * 0.05;

          if (Math.abs(latDiff) < 0.0001 && Math.abs(lngDiff) < 0.0001) {
            clearInterval(interval);
            setTracking(false);
            return location;
          }

          return {
            lat: prevLocation.lat + latDiff,
            lng: prevLocation.lng + lngDiff,
          };
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [tracking, volunteerLocation, location]);

  return (
    <>
      {!token && (
        <Modal show={signIn} onHide={onHide} centered>
          <Modal.Header closeButton>
            <Modal.Title>Selected</Modal.Title>
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
            <Form.Label>Select Location on Map</Form.Label>
            <MapContainer
              center={[28.6448, 77.2167]}
              zoom={5}
              style={{ height: "400px", width: "100%" }}
              ref={mapRef}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMap />
            </MapContainer>
            <input
              type="text"
              value={address}
              readOnly
              placeholder="Selected location address"
              style={{ width: "100%", padding: "10px", marginTop: "10px" }}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPhoto">
            <Form.Label>Photo</Form.Label>
            <Form.Control type="file" accept="image/*" capture="environment" />
            <Form.Text className="text-muted">
              You can upload a photo or click a new one.
            </Form.Text>
          </Form.Group>

          <Button variant="primary" type="button" block onClick={handleSubmit}>
            Submit
          </Button>
        </Form>

        {tracking && (
          <>
            <h3 className="text-center mt-4">Volunteer is on the Way!</h3>
            <MapContainer
              center={volunteerLocation}
              zoom={10}
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {/* User Location */}
              <Marker position={location}>
                <Popup>Your Location</Popup>
              </Marker>
              {/* Volunteer Location */}
              <Marker position={volunteerLocation}>
                <Popup>Volunteer Location</Popup>
              </Marker>
              {/* Tracking line between user and volunteer */}
              <Polyline
                positions={[volunteerLocation, location]}
                color="blue"
                weight={5}
              />
            </MapContainer>
          </>
        )}
      </Container>
    </>
  );
};

export default Helpneeded;
