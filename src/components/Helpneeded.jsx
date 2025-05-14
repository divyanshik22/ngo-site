import React, { useState, useRef, useEffect } from "react";
import { Modal, Form, Row, Col, Container,Table, Button, Badge, Alert  } from "react-bootstrap";
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
// import RequestHistory from "./RequestHistory";
L.Marker.prototype.options.icon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
const RequestHistory = ({ userType,showHistory,
  setShowHistory }) => {
  const [volunteerLocationRequest, setVolunteerLocationRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm,setShouForm] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please log in to view request history');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        'https://ngo-ri24.onrender.com/api/helprequest',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Response data:', response.data); // Debug log

      if (response.data && response.data.data) {
        setRequests(response.data.data);
      } else {
        setError('No data received from server');
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        if (error.response.status === 401) {
          setError('Please log in to view request history');
        } else if (error.response.status === 403) {
          setError('You do not have permission to view this content');
        } else {
          setError('Failed to fetch requests. Please try again later.');
        }
      } else if (error.request) {
        setError('No response from server. Please check your internet connection.');
      } else {
        setError('Failed to fetch requests. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (resolved) => {
    return resolved ? 
      <Badge bg="success">Resolved</Badge> : 
      <Badge bg="warning">Pending</Badge>;
  };
  const handleNewRequest = () =>{
    setShowHistory(false);
  }
  const handleViewMap = (request) => {
    setSelectedRequest(request);
    setShowMap(true);
  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setVolunteerLocationRequest({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          setVolunteerLocationRequest(null);
        }
      );
    }
  };
  

  if (error) {
    return (
      <div className="container mt-4">
        <Alert variant="warning">
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <>
    <div className="container mt-4">
      <h2 className="text-center mb-4" style={{color:'#0F6465'}}>Request History</h2>
      
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : requests.length === 0 ? (
        <Alert variant="info">
          No requests found. Create a new request to get started!
        </Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Help Type</th>
              <th>Status</th>
              <th>Problem</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id}>
                <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                <td>{request.name}</td>
                <td>{request.Helpfor}</td>
                <td>{getStatusBadge(request.resolved)}</td>
                <td>{request.problem}</td>
                <td>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => handleViewMap(request)}
                    className="me-2"
                  >
                    View Map
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal 
        show={showMap} 
        onHide={() => setShowMap(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Request Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest && (
          <MapContainer
          center={[parseFloat(selectedRequest.locationLat), parseFloat(selectedRequest.locationlong)]}
          zoom={13}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
          {/* Request Location Marker */}
          <Marker
            position={[
              parseFloat(selectedRequest.locationLat),
              parseFloat(selectedRequest.locationlong)
            ]}
          >
            <Popup>
              <div>
                <strong>{selectedRequest.name}</strong><br />
                {selectedRequest.Helpfor}<br />
                {selectedRequest.problem}
              </div>
            </Popup>
          </Marker>
        
          {/* Volunteer Location Marker */}
          {volunteerLocationRequest && (
            <>
              <Marker position={[volunteerLocationRequest.lat, volunteerLocationRequest.lng]}>
                <Popup>You are here (Volunteer)</Popup>
              </Marker>
        
              {/* Polyline from Volunteer to Request */}
              <Polyline
                positions={[
                  [volunteerLocationRequest.lat, volunteerLocationRequest.lng],
                  [parseFloat(selectedRequest.locationLat), parseFloat(selectedRequest.locationlong)]
                ]}
                pathOptions={{ color: 'blue', weight: 3 }}
              />
            </>
          )}
        </MapContainer>
        
         
          )}
        </Modal.Body>
      </Modal>
      <div className="text-center mt-4">
              <Button 
                onClick={handleNewRequest}
                className="custom-button"
                style={{
                  backgroundColor: '#0F6465',
                  borderColor: '#0F6465',
                  padding: '10px 30px',
                  fontSize: '1.1rem'
                }}
              >
                Create New Request
              </Button>
            </div>
    </div>
    </>
  );
};

const HelpForm = ({token,
  userType,
  handleToken,
  handleUser,
  username,
  handleLogout,
showHistory,
setShowHistory}) =>{
  const [volunteers, setVolunteers] = useState([]);
  const [helpType, setHelpType] = useState("");
  const [signIn, setSignIn] = useState(true);
  const [showSignup, setShowSignup] = useState(false);
  const [location, setLocation] = useState(() => {
    const savedLocation = localStorage.getItem('helpLocation');
    return savedLocation ? JSON.parse(savedLocation) : null;
  });
  const [address, setAddress] = useState(() => {
    const savedAddress = localStorage.getItem('helpAddress');
    return savedAddress || "";
  });
  const [tracking, setTracking] = useState(() => {
    const savedTracking = localStorage.getItem('helpTracking');
    return savedTracking ? JSON.parse(savedTracking) : false;
  });
  const [volunteerLocation, setVolunteerLocation] = useState(() => {
    const savedVolunteerLocation = localStorage.getItem('volunteerLocation');
    return savedVolunteerLocation ? JSON.parse(savedVolunteerLocation) : null;
  });
  const [route, setRoute] = useState([]);
  const mapRef = useRef();
  const form = useRef();
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  
  // Save location to localStorage whenever it changes
  useEffect(() => {
    if (location) {
      localStorage.setItem('helpLocation', JSON.stringify(location));
    }
  }, [location]);

  // Save address to localStorage whenever it changes
  useEffect(() => {
    if (address) {
      localStorage.setItem('helpAddress', address);
    }
  }, [address]);

  // Save tracking state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('helpTracking', JSON.stringify(tracking));
  }, [tracking]);

  // Save volunteer location to localStorage whenever it changes
  useEffect(() => {
    if (volunteerLocation) {
      localStorage.setItem('volunteerLocation', JSON.stringify(volunteerLocation));
    }
  }, [volunteerLocation]);

  // Cleanup function for logout
  const handleLogoutCleanup = () => {
    localStorage.removeItem('helpTracking');
    localStorage.removeItem('volunteerLocation');
    localStorage.removeItem('helpLocation');
    localStorage.removeItem('helpAddress');
    setTracking(false);
    setVolunteerLocation(null);
    setLocation(null);
    setAddress("");
    handleLogout();

  };

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

  const validateForm = () => {
    const errors = {};
    const formData = new FormData(form.current);
    
    if (!formData.get('username')?.trim()) {
      errors.username = 'Name is required';
    }
    
    if (!formData.get('phonenumber')?.trim()) {
      errors.phonenumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.get('phonenumber'))) {
      errors.phonenumber = 'Please enter a valid 10-digit phone number';
    }
    
    if (!formData.get('useremail')?.trim()) {
      errors.useremail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.get('useremail'))) {
      errors.useremail = 'Please enter a valid email address';
    }
    
    if (!formData.get('userstate')?.trim()) {
      errors.userstate = 'Problem description is required';
    }
    
    if (!helpType) {
      errors.helpType = 'Please select help type';
    }
    
    if (!location) {
      errors.location = 'Please select a location on the map';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Send email
      await emailjs.sendForm('service_j9djpim', 'template_4xo3889', form.current, {
        publicKey: '6CTOn2FhRGqpR0cwc',
      });
      
      // Store request in database only if user is logged in
      if (localStorage.getItem('token')) {
        const formData = new FormData(form.current);
        const requestData = {
          name: formData.get('username'),
          email: formData.get('useremail'),
          phone: formData.get('phonenumber'),
          problem: formData.get('userstate'),
          Helpfor: helpType === 'animal' ? 'Animal Help' : 'People Help',
          locationLat: location.lat.toString(),
          locationlong: location.lng.toString(),
          resolved: false,
          createdAt: new Date()
        };

        await axios.post(
          'https://ngo-ri24.onrender.com/api/helprequest',
          requestData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }
      
      if (location) {
        findNearestVolunteer();
        setTracking(true);
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchCurrentLocation = async () => {
      if (!location && navigator.geolocation) {
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
  }, [location]);

  // Add this new function to handle new request
  const handleNewRequest = () => {
    // Clear all stored data
    localStorage.removeItem('helpTracking');
    localStorage.removeItem('volunteerLocation');
    localStorage.removeItem('helpLocation');
    localStorage.removeItem('helpAddress');
    
    // Reset all states
    setTracking(false);
    setVolunteerLocation(null);
    setLocation(null);
    setAddress("");
    setHelpType("");
    form.current?.reset();
    setFormErrors({});
  };
return(
 <>
 <div className="d-flex justify-content-end mb-3">
          <Button 
            variant="outline-primary"
            onClick={() => setShowHistory(true)}
            className="custom-button"
            style={{
              backgroundColor: '#0F6465',
              borderColor: '#0F6465',
              color: 'white'
            }}
          >
            View Request History
          </Button>
        </div>

        {!tracking && !showHistory && <><h2 className="text-center mb-4" style={{color:'#0F6465'}}>Enter the Details</h2>
        <Form ref={form} noValidate>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="formName">
                <Form.Label style={{color:'#0F6465'}}>Your Name <span className="text-danger">*</span></Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter your name" 
                  name="username"  
                  className={`custom-input ${formErrors.username ? 'is-invalid' : ''}`}
                  required
                />
                {formErrors.username && <div className="invalid-feedback">{formErrors.username}</div>}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formNumber">
                <Form.Label style={{color:'#0F6465'}}>Number <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your phone number"
                  className={`custom-input ${formErrors.phonenumber ? 'is-invalid' : ''}`}
                  name="phonenumber"
                  required
                />
                {formErrors.phonenumber && <div className="invalid-feedback">{formErrors.phonenumber}</div>}
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="formEmail">
                <Form.Label style={{color:'#0F6465'}}>Email <span className="text-danger">*</span></Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="Enter your email" 
                  name="useremail" 
                  className={`custom-input ${formErrors.useremail ? 'is-invalid' : ''}`}
                  required
                />
                {formErrors.useremail && <div className="invalid-feedback">{formErrors.useremail}</div>}
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="formProblem">
            <Form.Label style={{color:'#0F6465'}}>State the Problem <span className="text-danger">*</span></Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Describe the problem"
              className={`custom-input ${formErrors.userstate ? 'is-invalid' : ''}`}
              name="userstate"
              required
            />
            {formErrors.userstate && <div className="invalid-feedback">{formErrors.userstate}</div>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{color:'#0F6465'}}>Help needed for <span className="text-danger">*</span></Form.Label>
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
                required
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
                required
              />
            </div>
            {formErrors.helpType && <div className="text-danger mt-1">{formErrors.helpType}</div>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{color:'#0F6465'}}>Select Location on Map <span className="text-danger">*</span></Form.Label>
            {location ? (
              <MapContainer
                center={location}
                zoom={15}
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
              className={`custom-input ${formErrors.location ? 'is-invalid' : ''}`}
              name="userlocation"
            />
            {formErrors.location && <div className="invalid-feedback">{formErrors.location}</div>}
          </Form.Group>

          <Button 
            type="submit" 
            onClick={handleSubmit} 
            className="custom-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </Form></>}

        {tracking && !showHistory && volunteerLocation && (
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
            <div className="text-center mt-4">
              <Button 
                onClick={handleNewRequest}
                className="custom-button"
                style={{
                  backgroundColor: '#0F6465',
                  borderColor: '#0F6465',
                  padding: '10px 30px',
                  fontSize: '1.1rem'
                }}
              >
                Create New Request
              </Button>
            </div>
          </>
        )}
 </>
)
}
const Helpneeded = ({
  token,
  userType,
  handleToken,
  handleUser,
  username,
  handleLogout,
}) => {
  const [showHistory, setShowHistory] = useState(false);
  
  return (
    <>
      <FormContainer 
      >
        {!showHistory && (
          <HelpForm
          token={token}
        handleToken={handleToken}
        userType={userType}
        username={username}
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        
          />
        )}
        
        {showHistory && (
          <RequestHistory 
            userType={userType}
            showHistory={showHistory}
            setShowHistory={setShowHistory}
        
          />
        )}
      </FormContainer>
    </>
  );
};

export default Helpneeded;
