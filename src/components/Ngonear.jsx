import React, { useState, useEffect } from "react";
import Navbar from "./NavbarComponent";
import LogIn from "./Login";
import "./Homepage.css";
import { db } from "../firebase"; // Adjust path to Firebase config
import { collection, getDocs } from "firebase/firestore"; // Firebase methods
import { Container, Table, Button } from "react-bootstrap";

const Ngonear = ({
  token,
  userType,
  handleToken,
  handleUser,
  username,
  handleLogout,
}) => {
  const [showSignup, setShowSignup] = useState(false);
  const [ngos, setNgos] = useState([]);

  // Fetch NGO data from Firebase
  useEffect(() => {
    const fetchNgos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "NgoDetails"));
        const ngosList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(ngosList);
        setNgos(ngosList);
      } catch (error) {
        console.error("Error fetching NGOs:", error);
      }
    };

    fetchNgos();
  }, []);

  const handleClose = () => {
    setShowSignup(false);
  };

  return (
    <>
      {showSignup && <LogIn show={showSignup} handleClose={handleClose} />}
      <Navbar
        token={token}
        handleToken={handleToken}
        handleUser={handleUser}
        username={username}
        handleLogout={handleLogout}
      />

      <Container>
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
            {ngos.map((ngo) => (
              <tr key={ngo.id}>
                <td>{ngo.name}</td>
                <td>{ngo.email}</td>
                <td>{ngo.phone}</td>
                <td>{ngo.website}</td>
                <td>{ngo.reviews}</td>
                <td>{ngo.location}</td>
                <td>
                  <Button variant="info">View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default React.memo(Ngonear);
