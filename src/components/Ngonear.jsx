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

      <Container className="ngo-container">
        <h2 className="ngo-title">NGOs Near You</h2>
        <Table className="ngo-table" hover>
          <thead>
            <tr>
              <th>NGO Name</th>
              <th>Contact Email</th>
              <th>Phone</th>
              <th>Website</th>
              <th>Rating</th>
              <th>Location</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {ngos.map((ngo) => (
              <tr key={ngo.id}>
                <td>{ngo.name}</td>
                <td>{ngo.email}</td>
                <td>{ngo.phone}</td>
                <td>
                  {ngo.website ? (
                    <a href={ngo.website} target="_blank" rel="noopener noreferrer" style={{ color: '#D2691E' }}>
                      Visit Website
                    </a>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td>
                  {ngo.reviews ? `${ngo.reviews} ⭐` : 'No reviews'}
                </td>
                <td>{ngo.location}</td>
                <td>
                  <Button className="ngo-view-btn">View Details</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {ngos.length === 0 && (
          <div className="text-center py-5" style={{ color: '#D2691E' }}>
            <h4>Loading NGOs...</h4>
          </div>
        )}
      </Container>
    </>
  );
};

export default React.memo(Ngonear);
