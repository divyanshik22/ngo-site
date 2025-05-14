import React, { useState, useEffect, useRef } from "react";
import Navbar from "../Navbar/NavbarComponent";
import { Container, Table, Button, Form, Modal, Nav, Card, InputGroup } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import axios from "../../interceptors/axiosInterceptor";
import "leaflet/dist/leaflet.css";
import { db } from "../../firebase"; // Adjust path if needed
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import "./List.css";

const Ngodetails = ({
  token,
  handleToken,
  userType,
  username,
  handleLogout,
}) => {
  const [ngos, setNgos] = useState([]);
  const [user, setUser] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    reviews: "",
    location: "",
  });
  const [address, setAddress] = useState("");
  const [markerPosition, setMarkerPosition] = useState([28.6448, 77.2167]);
  const [showModal, setShowModal] = useState(false);
  const [selectedNgo, setSelectedNgo] = useState(null);
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  // Fetch NGOs from Firebase
  useEffect(() => {
    const fetchNgos = async () => {
       const response = await axios.get(`https://ngo-ri24.onrender.com/api/ngos`);
       setNgos(response.data.data);
    };
    fetchNgos();
  }, []);

  // Reverse geocoding to get location name from lat, lng
  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      return response.data.display_name || `${lat}, ${lng}`;
    } catch (error) {
      console.error("Error fetching location:", error);
      return `${lat}, ${lng}`;
    }
  };

  // Location search suggestions
  const handleLocationSearch = async (event) => {
    const query = event.target.value;
    if (query.length > 2) {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
        );
        const suggestions = response.data.map((item) => item.display_name);
        setLocationSuggestions(suggestions);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      }
    } else {
      setLocationSuggestions([]);
    }
  };

  // Handle NGO deletion
  const handleDeleteNgo = async (id) => {
    try {
      const ngoDocRef = doc(db, "NgoDetails", id);
      await deleteDoc(ngoDocRef);
      setNgos(ngos.filter((ngo) => ngo.id !== id)); // Remove from the local state
    } catch (error) {
      console.error("Error deleting NGO:", error);
    }
  };

  // Handle adding NGO
  const handleAddNgo = async () => {
    try {
      const newNgo = { ...formData, location: address };
      await addDoc(collection(db, "NgoDetails"), newNgo);
      setNgos([...ngos, newNgo]);
      setShowForm(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        website: "",
        reviews: "",
        location: "",
      });
    } catch (error) {
      console.error("Error adding NGO:", error);
    }
  };

  const handleLocationSelect = (suggestion) => {
    setAddress(suggestion);
    setLocationSuggestions([]);
  };

  // LocationMarker to update map when clicked
  const LocationMarker = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        setMarkerPosition([lat, lng]);
        reverseGeocode(lat, lng).then((locationName) => {
          setAddress(locationName); // Update the address state
        });
      },
    });
    return <Marker position={markerPosition} />;
  };

  return (
    <>
      <Navbar
        token={token}
        handleToken={handleToken}
        username={username}
        handleLogout={handleLogout}
      />
      <Container className="ngo-container">
        <Card className="data-card">
          <Card.Header>
            <h2 className="mb-0">NGO Directory</h2>
          </Card.Header>
          <Card.Body>
            <div className="mb-4">
              <InputGroup className="search-input-group">
                <InputGroup.Text>
                  <i className="fas fa-search"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search NGOs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>
            </div>

            <div className="table-responsive">
              <Table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Website</th>
                    <th>Reviews</th>
                    <th>Location</th>
                    {localStorage.getItem("token") === 'admin' && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {ngos
                    .filter((ngo) =>
                      ngo.name.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((ngo) => (
                      <tr key={ngo.id}>
                        <td>{ngo?.name}</td>
                        <td>{ngo?.email}</td>
                        <td>{ngo?.phone}</td>
                        <td>
                          {ngo?.website ? (
                            <a href={ngo?.website} target="_blank" rel="noopener noreferrer" className="table-link">
                              Visit Website
                            </a>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td>
                          {ngo?.reviews ? `${ngo?.reviews} ⭐` : 'No reviews'}
                        </td>
                        <td>{ngo?.location}</td>
                        <td>
                          <Button
                            className="action-btn me-2"
                            onClick={() => {
                              setSelectedNgo(ngo);
                              setShowModal(true);
                            }}
                          >
                            View
                          </Button>
                          
                          {localStorage.getItem("token") === 'admin' && <Button
                            className="action-btn"
                            onClick={() => handleDeleteNgo(ngo?.id)}
                          >
                            Delete
                          </Button>}
                          
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>

            {ngos.length === 0 && (
              <div className="text-center py-5">
               
                <h4 className="loading-text">Loading NGOs...</h4>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>

      {/* Add NGO Form Modal */}
      <Modal show={showForm} onHide={() => setShowForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add NGO</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Website</Form.Label>
              <Form.Control
                type="text"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Reviews</Form.Label>
              <Form.Control
                as="textarea"
                value={formData.reviews}
                onChange={(e) =>
                  setFormData({ ...formData, reviews: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Location</Form.Label>
              <input
                type="text"
                value={address}
                onChange={handleLocationSearch}
                placeholder="Enter location"
                style={{ width: "100%", padding: "10px" }}
              />
              <ul>
                {locationSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleLocationSelect(suggestion)}
                    style={{ cursor: "pointer" }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            </Form.Group>
            <MapContainer
              center={markerPosition}
              zoom={13}
              style={{ height: "300px", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker />
            </MapContainer>
            <Button onClick={handleAddNgo}>Add NGO</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* NGO Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>NGO Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedNgo && (
            <div>
              <p>Name: {selectedNgo.name}</p>
              <p>Email: {selectedNgo.email}</p>
              <p>Phone: {selectedNgo.phone}</p>
              <p>Website: {selectedNgo.website}</p>
              <p>Reviews: {selectedNgo.reviews}</p>
              <p>Location: {selectedNgo.location}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Ngodetails;
