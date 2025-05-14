import React, { useState, useEffect, useRef } from "react";
import Navbar from "../Navbar/NavbarComponent";
import { Container, Table, Button, Form, Modal, Nav, Card, InputGroup } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import axios from "../../interceptors/axiosInterceptor";
import "./List.css";

const HelpRequest = ({
  token,
  handleToken,
  userType,
  username,
  handleLogout,
}) => {
  const [request, setRequest] = useState([]);


  // Fetch NGOs from Firebase
  useEffect(() => {
    const fetchRequest = async () => {
      console.log("Token",localStorage.getItem("token"))
      // const response = await axios.get(`https://ngo-ri24.onrender.com/api/helprequest`);
      const response = await axios.get(`https://ngo-ri24.onrender.com/api/helprequest`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      console.log(response.data.data)
      setRequest(response.data.data)
    };
    fetchRequest();
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
            <h2 className="mb-0">Request Directory</h2>
          </Card.Header>
          <Card.Body>
            <div className="mb-4">
              <InputGroup className="search-input-group">
                <InputGroup.Text>
                  <i className="fas fa-search"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search Request..."
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
                    <th>Phone Number</th>
                    <th>Problem</th>
                    <th>HelpFor</th>
                    <th>Status</th>
                    <th>Resolved</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {request
                    .map((request) => (
                      <tr key={request.id}>
                        <td>{request?.name}</td>
                        <td>{request?.email}</td>
                        <td>{request?.phone}</td>
                        <td>{request?.problem}</td>
                        <td>{request?.Helpfor}</td>
                        <td>{request?.resolved}</td>
                        <td>
                            <Button
                              className="action-btn"
                              // onClick={() => handleDeleterequest(request?.id)}
                            >
                              Resolved
                            </Button>
                        </td>
                        <td>
                            <Button
                              className="action-btn"
                              // onClick={() => handleDeleterequest(request?.id)}
                            >
                              Delete
                            </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>

            {request?.length === 0 && (
              <div className="text-center py-5">
               
                <h4 className="loading-text">Loading Request...</h4>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default HelpRequest;
