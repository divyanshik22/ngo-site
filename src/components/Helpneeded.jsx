import React, { useState, useRef, useEffect } from "react";
import { Modal, Form, Button, Row, Col, Container } from "react-bootstrap";
import Navbar from "./Navbar/NavbarComponent";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import axios from "../interceptors/axiosInterceptor";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import TopImage from "../images/BorderAnimal.png";
import "./common.css";
import Aboutus from "./About/Aboutus";
import BottomBorder from "../images/BottomBorder.png";
import emailjs from '@emailjs/browser';
import FormContainer from "./Common/FormContainer";
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
  const form = useRef();

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

    if (nearestVolunteer && minDistance <= 30000) {
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

  const handleSubmit = (e) => {
    console.log(location);
    e.preventDefault();

    emailjs
      .sendForm('service_j9djpim', 'template_4xo3889', form.current, {
        publicKey: '6CTOn2FhRGqpR0cwc',
      })
      .then(
        () => {
          console.log('SUCCESS! Mail sent');
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );
    if (location) {
      findNearestVolunteer();
      setTracking(true);
      console.log(location);
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
        console.log(volunteersList);
      } catch (error) {
        console.error("Error fetching volunteers:", error);
      }
    };

    fetchVolunteers();
  }, []);

  return (
    <>
      <FormContainer token={token}
        handleToken={handleToken}
        userType={userType}
        username={username}
        handleLogout={handleLogout}>
          <h2 className="text-center mb-4" style={{color:'#0F6465'}}>Enter the Details</h2>
        <Form ref={form}>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="formName">
                <Form.Label style={{color:'#0F6465'}}>Your Name</Form.Label>
                <Form.Control type="text" placeholder="Enter your name" name="username"  className="custom-input"/>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formNumber">
                <Form.Label style={{color:'#0F6465'}}>Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your phone number"
                  className="custom-input"
                  name="phonenumber"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="formEmail">
                <Form.Label style={{color:'#0F6465'}}>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter your email" name="useremail" className="custom-input"/>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="formProblem">
            <Form.Label style={{color:'#0F6465'}}>State the Problem</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Describe the problem"
              className="custom-input"
              name="userstate"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{color:'#0F6465'}}>Help needed for</Form.Label>
            <div>
              <Form.Check
                type="radio"
                label="Animal"
                name="helpType"
                value="animal"
                onChange={() => setHelpType("animal")}
                checked={helpType === "animal"}
                inline
                className="custom-radio"
              />
              <Form.Check
                type="radio"
                label="People around you"
                name="helpType"
                value="people"
                onChange={() => setHelpType("people")}
                checked={helpType === "people"}
                inline
                className="custom-radio"
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{color:'#0F6465'}} >Select Location on Map</Form.Label>
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
              className="custom-input"
              name="userlocation"
            />
          </Form.Group>

          <Button type="submit" onClick={(e)=>{handleSubmit(e);}} className="custom-button">
            Submit
          </Button>
        </Form>

        {tracking && volunteerLocation && (
          <>
            <h3 className="text-center mt-4" style={{color:'#0F6465'}}>Volunteer is on the Way!</h3>
            <MapContainer
              center={location}
              zoom={10}
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={location}>
                <Popup style={{color:'#0F6465'}}>Your Location</Popup>
              </Marker>
              <Marker position={volunteerLocation}>
                <Popup style={{color:'#0F6465'}}>Volunteer Location</Popup>
              </Marker>
              <Polyline
                positions={[location, volunteerLocation]}
                color="blue"
                weight={5}
              />
            </MapContainer>
          </>
        )}
       </FormContainer>
    </>
  );
};

export default Helpneeded;
