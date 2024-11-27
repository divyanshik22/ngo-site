import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Pagination,
  Form,
  InputGroup,
  Container,
} from "react-bootstrap";
import Navbar from "./NavbarAdmin";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase"; // Adjust path if needed

const VolunteerList = ({
  token,

  handleToken,
  username,
  handleLogout,
}) => {
  const [volunteers, setVolunteers] = useState([]);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch volunteer data from Firebase
  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Users"));
        const volunteersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVolunteers(volunteersList);
      } catch (error) {
        console.error("Error fetching volunteers:", error);
      }
    };
    fetchVolunteers();
  }, []);

  // Delete a volunteer record
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "Users", id));
      setVolunteers(volunteers.filter((volunteer) => volunteer.id !== id));
    } catch (error) {
      console.error("Error deleting volunteer:", error);
    }
  };

  // Filtered and Searched Volunteers
  const filteredVolunteers = volunteers.filter(
    (volunteer) =>
      volunteer.location.includes(locationFilter) &&
      (volunteer.username.toLowerCase().includes(search.toLowerCase()) ||
        volunteer.location.toLowerCase().includes(search.toLowerCase()))
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVolunteers = filteredVolunteers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredVolunteers.length / itemsPerPage);

  // Pagination buttons
  const paginationItems = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationItems.push(
      <Pagination.Item
        key={i}
        active={i === currentPage}
        onClick={() => setCurrentPage(i)}
      >
        {i}
      </Pagination.Item>
    );
  }

  return (
    <>
      <Navbar
        token={token}
        handleToken={handleToken}
        username={username}
        handleLogout={handleLogout}
      />
      <Container>
        <h3>List of Volunteers</h3>

        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Search by name or location"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Form.Control
            placeholder="Filter by location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />
        </InputGroup>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Username</th>

              <th>Email</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentVolunteers
              .filter((volunteer) =>
                volunteer.email.toLowerCase().includes("volunteer")
              )
              .map((volunteer) => (
                <tr key={volunteer.id}>
                  <td>{volunteer.username}</td>
                  <td>{volunteer.email}</td>
                  <td>{volunteer.phone}</td>
                  <td>{volunteer.location}</td>
                  <td>{volunteer.active}</td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(volunteer.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>

        <Pagination className="justify-content-center">
          {paginationItems}
        </Pagination>
      </Container>
    </>
  );
};

export default VolunteerList;
