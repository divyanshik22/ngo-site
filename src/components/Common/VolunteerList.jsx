import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Pagination,
  Form,
  InputGroup,
  Container,
  Card,
  Badge,
} from "react-bootstrap";
import Navbar from "../Navbar/NavbarComponent";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase"; // Adjust path if needed
import axios from "../../interceptors/axiosInterceptor";
import "./List.css"

const VolunteerList = ({
  token,
  handleToken,
  userType,
  username,
  handleLogout,
}) => {
  const [volunteers, setVolunteers] = useState([]);
  const [user, setUser] = useState("");
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch volunteer data from Firebase
  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await axios.get(`https://ngo-ri24.onrender.com/api/users?skip=${0}&limit=${1000}`);
        
        setVolunteers(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching volunteers:", error);
      }
    };
    fetchVolunteers();
  }, []);

  useEffect(() => {
    console.log("Updated volunteers:", volunteers);
  }, [volunteers]);

 

  // Pagination logic
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentVolunteers = filteredVolunteers.slice(
  //   indexOfFirstItem,
  //   indexOfLastItem
  // );
  // const totalPages = Math.ceil(filteredVolunteers.length / itemsPerPage);

  // // Pagination buttons
  // const paginationItems = [];
  // for (let i = 1; i <= totalPages; i++) {
  //   paginationItems.push(
  //     <Pagination.Item
  //       key={i}
  //       active={i === currentPage}
  //       onClick={() => setCurrentPage(i)}
  //     >
  //       {i}
  //     </Pagination.Item>
  //   );
  // }

  return (
    <>
      <Navbar
        token={token}
        handleToken={handleToken}
        username={username}
        handleLogout={handleLogout}
      />
      <Container className="ngo-container py-4">
        <Card className="data-card">
          <Card.Header>
            <h2 className="mb-0">Volunteer Directory</h2>
          </Card.Header>
          <Card.Body>
            <div>
              <InputGroup className="search-input-group">
                <InputGroup.Text>
                  <i className="fas fa-search"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search volunteers..."
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
                    <th>Contact Info</th>
                    <th>Location</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {volunteers.map((vol) => (
                    <tr key={vol.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar-circle me-2">
                            {vol?.name?.charAt(0)}
                          </div>
                          <div>
                            <h6 className="mb-0">{vol?.name}</h6>
                            <small className="text-muted">{vol?.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="info-text">
                          <div><i className="fas fa-phone"></i>{vol?.phone}</div>
                          <div><i className="fas fa-envelope"></i>{vol?.email}</div>
                        </div>
                      </td>
                      <td>
                        <div className="info-text">
                          <div>{vol?.address?.street}</div>
                          <div>{vol?.address?.city}, {vol?.address?.state}</div>
                          <div>{vol?.address?.country} - {vol?.address?.zipCode}</div>
                        </div>
                      </td>
                      <td>
                        <Badge>Active</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {volunteers.length === 0 && (
              <div className="text-center py-5">
               
                <h4 className="loading-text">Loading Volunteers...</h4>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default VolunteerList;
