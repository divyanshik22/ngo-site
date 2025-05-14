import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Badge, Alert } from 'react-bootstrap';
import axios from '../interceptors/axiosInterceptor';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import HelpNeeded from './Helpneeded'; // Adjust the path as per your folder structure



L.Marker.prototype.options.icon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const RequestHistory = ({ userType }) => {
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
    setShouForm(true);
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
    {showForm && (
          <HelpNeeded 
            userType={userType}
          />
        )}
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

export default RequestHistory; 