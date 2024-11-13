import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Pagination,
  Form,
  InputGroup,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import "./Profile.css";

const Profile = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Fetch volunteer data from Firebase
  useEffect(() => {
    const fetchVolunteers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const volunteersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVolunteers(volunteersList);
    };
    fetchVolunteers();
  }, []);

  // Delete a volunteer record
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "users", id));
    setVolunteers(volunteers.filter((volunteer) => volunteer.id !== id));
  };

  // Filter and Search Logic
  const filteredVolunteers = volunteers.filter(
    (volunteer) =>
      volunteer.location.includes(filter) &&
      (volunteer.name.toLowerCase().includes(search.toLowerCase()) ||
        volunteer.location.toLowerCase().includes(search.toLowerCase()))
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVolunteers = filteredVolunteers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredVolunteers.length / itemsPerPage);

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Volunteer Management</h2>
      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search by name or location"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={6}>
          <Form.Select
            onChange={(e) => setFilter(e.target.value)}
            defaultValue=""
          >
            <option value="">All Locations</option>
            <option value="Location1">Location1</option>
            <option value="Location2">Location2</option>
            {/* Add more locations as needed */}
          </Form.Select>
        </Col>
      </Row>

      <Table bordered hover responsive className="text-center">
        <thead>
          <tr>
            <th>Profile Photo</th>
            <th>Username</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentVolunteers.map((volunteer) => (
            <tr key={volunteer.id}>
              <td>
                <img
                  src={volunteer.profilePhoto}
                  alt="Profile"
                  width="50"
                  height="50"
                  className="rounded-circle"
                />
              </td>
              <td>{volunteer.username}</td>
              <td>{volunteer.name}</td>
              <td>{volunteer.email}</td>
              <td>{volunteer.phone}</td>
              <td>{volunteer.location}</td>
              <td>{volunteer.active ? "Yes" : "No"}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2">
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(volunteer.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <Pagination className="justify-content-center">
        {[...Array(totalPages)].map((_, idx) => (
          <Pagination.Item
            key={idx + 1}
            active={idx + 1 === currentPage}
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </Container>
  );
};

export default Profile;
