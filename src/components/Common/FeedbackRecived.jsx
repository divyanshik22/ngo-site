import React, { useState, useEffect, useRef } from "react";
import Navbar from "../Navbar/NavbarComponent";
import { Container, Table, Button, Form, Modal, Nav, Card, InputGroup } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import axios from "../../interceptors/axiosInterceptor";
import "./List.css";

const FeedbackRecived = ({
  token,
  handleToken,
  userType,
  username,
  handleLogout,
}) => {
  const [feedback, setfeedback] = useState([]);


  // Fetch NGOs from Firebase
  useEffect(() => {
    const fetchfeedback = async () => {
      console.log("Token",localStorage.getItem("token"))
      const response = await axios.get(`https://ngo-ri24.onrender.com/api/feedback`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      console.log(response.data.data)
      setfeedback(response.data.data)
    };
    fetchfeedback();
  }, []);



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
            <h2 className="mb-0">Feedback Directory</h2>
          </Card.Header>
          <Card.Body>
            <div className="mb-4">
              <InputGroup className="search-input-group">
                <InputGroup.Text>
                  <i className="fas fa-search"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search feedback..."
                  // value={search}
                  // onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>
            </div>

            <div className="table-responsive">
              <Table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Rating</th>
                    <th>Feedback</th>
                    {localStorage.getItem("token") === 'admin' && <th>Action</th> }
                    
                  </tr>
                </thead>
                <tbody>
                  {feedback
                    .map((feedback) => (
                      <tr key={feedback.id}>
                        <td>{feedback?.name}</td>
                        <td>{feedback?.email}</td>
                        <td>{feedback?.rating}</td>
                        <td>{feedback?.feedback}</td>
                        { localStorage.getItem("token") === 'admin' && <td>
                            <Button
                              className="action-btn"
                              // onClick={() => handleDeletefeedback(feedback?.id)}
                            >
                              Delete
                            </Button>
                        </td>}
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>

            {feedback?.length === 0 && (
              <div className="text-center py-5">
               
                <h4 className="loading-text">Loading feedbacked...</h4>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default FeedbackRecived;
