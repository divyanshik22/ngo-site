import React, { useState, useEffect, useRef } from "react";
import Navbar from "./NavbarAdmin";
import { Container, Table, Button, Form, Modal, Nav } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { db } from "../../firebase"; // Adjust path if needed
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const Ngodetails = ({ token, handleToken, username, handleLogout }) => {
  const [ngos, setNgos] = useState([]);
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
      const querySnapshot = await getDocs(collection(db, "NgoDetails"));
      const ngosList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNgos(ngosList);
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
      <Container>
        <h3 className="mt-3">NGO Details</h3>

        {/* Search & Add Button */}
        <Form inline className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mr-2"
          />
          <Button onClick={() => setShowForm(true)} className="mr-2">
            Add NGO
          </Button>
        </Form>

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

        {/* NGO Table */}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Website</th>
              <th>Reviews</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ngos
              .filter((ngo) =>
                ngo.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((ngo) => (
                <tr key={ngo.id}>
                  <td>{ngo.name}</td>
                  <td>{ngo.email}</td>
                  <td>{ngo.phone}</td>
                  <td>{ngo.website}</td>
                  <td>{ngo.reviews}</td>
                  <td>{ngo.location}</td>
                  <td>
                    <Button
                      variant="info"
                      onClick={() => {
                        setSelectedNgo(ngo);
                        setShowModal(true);
                      }}
                    >
                      View
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteNgo(ngo.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>

        {/* NGO Details Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
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
      </Container>
    </>
  );
};

export default Ngodetails;
