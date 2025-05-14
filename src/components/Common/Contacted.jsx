import React, { useState, useEffect, useRef } from "react";
import Navbar from "../Navbar/NavbarComponent";
import { Container, Table, Button, Form, Modal, Nav, Card, InputGroup } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import axios from "../../interceptors/axiosInterceptor";
import "./List.css";

const Contacted = ({
  token,
  handleToken,
  userType,
  username,
  handleLogout,
}) => {
  const [contact, setContact] = useState([]);


  // Fetch NGOs from Firebase
  useEffect(() => {
    const fetchcontact = async () => {
      console.log("Token",localStorage.getItem("token"))
      const response = await axios.get(`https://ngo-ri24.onrender.com/api/contact`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      console.log(response.data.data)
      setContact(response.data.data)
    };
    fetchcontact();
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
            <h2 className="mb-0">Contact Directory</h2>
          </Card.Header>
          <Card.Body>
            <div className="mb-4">
              <InputGroup className="search-input-group">
                <InputGroup.Text>
                  <i className="fas fa-search"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search contact..."
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
                    <th>Message</th>
                    {localStorage.getItem("token") === 'admin' && <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {contact
                    .map((contact) => (
                      <tr key={contact.id}>
                        <td>{contact?.name}</td>
                        <td>{contact?.email}</td>
                        <td>{contact?.phone}</td>
                        <td>{contact?.message}</td>
                        {localStorage.getItem("token") === 'admin' && <td>
                            <Button
                              className="action-btn"
                              // onClick={() => handleDeletecontact(contact?.id)}
                            >
                              Delete
                            </Button>
                        </td>}
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>

            {contact?.length === 0 && (
              <div className="text-center py-5">
               
                <h4 className="loading-text">Loading contacted...</h4>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default Contacted;
