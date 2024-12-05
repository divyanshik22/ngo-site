import React, { useState, useRef, useEffect } from "react";
import { Modal, Form, Button, Row, Col, Container } from "react-bootstrap";
import Navbar from "./NavbarComponent";
import LogIn from "./Login";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const Helpneeded = ({
  token,
  userType,
  handleToken,
  handleUser,
  username,
  handleLogout,
}) => {
  const [volunteers, setVolunteers] = useState([]);
  const [helpType, setHelpType] = useState("");
  const [signIn, setSignIn] = useState(true);
  const [showSignup, setShowSignup] = useState(false);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [tracking, setTracking] = useState(false);
  const [volunteerLocation, setVolunteerLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const mapRef = useRef();

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const findNearestVolunteer = () => {
    if (!location) {
      console.error("User location not available.");
      return;
    }

    let nearestVolunteer = null;
    let minDistance = Infinity;

    volunteers.forEach((volunteer) => {
      if (volunteer.lat && volunteer.lng) {
        const distance = calculateDistance(
          location.lat,
          location.lng,
          volunteer.lat,
          volunteer.lng
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearestVolunteer = volunteer;
        }
      }
    });

    if (nearestVolunteer && minDistance <= 300) {
      setVolunteerLocation({
        lat: nearestVolunteer.lat,
        lng: nearestVolunteer.lng,
      });
      console.log("Tracking nearest volunteer:", nearestVolunteer);
    } else {
      console.log("No nearby Volunteer");
    }
  };

  const LocationMap = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setLocation({ lat, lng });
        getAddress(lat, lng);
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

  const handleSubmit = () => {
    if (location) {
      findNearestVolunteer();
      setTracking(true);
    } else {
      alert("Please select a location.");
    }
  };

  useEffect(() => {
    const fetchCurrentLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const currentLocation = { lat: latitude, lng: longitude };
            setLocation(currentLocation);
            getAddress(latitude, longitude);
          },
          (error) => {
            console.error("Geolocation error:", error);
          },
          { enableHighAccuracy: true }
        );
      }
    };

    fetchCurrentLocation();

    const fetchVolunteers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Users"));
        const volunteersList = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((volunteer) => volunteer.lat && volunteer.lng);
        setVolunteers(volunteersList);
      } catch (error) {
        console.error("Error fetching volunteers:", error);
      }
    };

    fetchVolunteers();
  }, []);

  return (
    <>
      <Navbar
        token={token}
        handleToken={handleToken}
        handleUser={handleUser}
        username={username}
        handleLogout={handleLogout}
      />
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

          <Form.Group className="mb-3">
            <Form.Label>Select Location on Map</Form.Label>
            {location ? (
              <MapContainer
                center={location}
                zoom={15} // Zoomed in closer to user's location
                style={{ height: "400px", width: "100%" }}
                ref={mapRef}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMap />
              </MapContainer>
            ) : (
              <div
                style={{
                  height: "400px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span>Please allow to access the location</span>
              </div>
            )}
            <input
              type="text"
              value={address}
              readOnly
              placeholder="Selected location address"
              style={{ width: "100%", padding: "10px", marginTop: "10px" }}
            />
          </Form.Group>

          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Form>

        {tracking && volunteerLocation && (
          <>
            <h3 className="text-center mt-4">Volunteer is on the Way!</h3>
            <MapContainer
              center={location}
              zoom={10}
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={location}>
                <Popup>Your Location</Popup>
              </Marker>
              <Marker position={volunteerLocation}>
                <Popup>Volunteer Location</Popup>
              </Marker>
              <Polyline
                positions={[location, volunteerLocation]}
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
