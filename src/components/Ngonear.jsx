import React, { useState, useEffect } from "react";
import Navbar from "./Navbar/NavbarComponent";
import "./Common/List.css";
import { db } from "../firebase"; // Adjust path to Firebase config
import { collection, getDocs } from "firebase/firestore"; // Firebase methods
import { Container, Table, Button, Card } from "react-bootstrap";
import axios from "../interceptors/axiosInterceptor";

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
      {/* {showSignup && <LogIn show={showSignup} handleClose={handleClose} />} */}
      <Navbar
        token={token}
        handleToken={handleToken}
        handleUser={handleUser}
        username={username}
        handleLogout={handleLogout}
      />

      <Container className="ngo-container">
        <Card className="data-card">
          <Card.Header>
            <h2 className="mb-0">NGOs Near You</h2>
          </Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <Table className="data-table">
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
                          <a href={ngo.website} target="_blank" rel="noopener noreferrer" className="table-link">
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
                        <Button className="action-btn">View Details</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {ngos.length === 0 && (
              <div className="text-center py-5">
                <h4 className="loading-text">Loading NGOs...</h4>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default React.memo(Ngonear);
