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

const FeedbackRecived = ({
  token,
  handleToken,
  username,
  userType,
  handleLogout,
}) => {
  const [feedback, setFeedback] = useState([]);
  const [user, setUser] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch feedbacks data from Firebase
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Feedback"));
        const feedbackList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFeedback(feedbackList);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };
    fetchFeedback();
    setUser(userType);
  }, []);

  // Delete a feedbacks record
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "Users", id));
      setFeedback(feedback.filter((feedbacks) => feedbacks.id !== id));
    } catch (error) {
      console.error("Error deleting feedbacks:", error);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentfeedback = feedback.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(feedback.length / itemsPerPage);

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
        <h3>List of feedback</h3>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Rating</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {currentfeedback.map((feedbacks) => (
              <tr key={feedbacks.id}>
                <td>{feedbacks.name}</td>
                <td>{feedbacks.email}</td>
                <td>{feedbacks.rating}</td>
                <td>{feedbacks.feedback}</td>
                {user == "volunteer-token" ? (
                  ""
                ) : (
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(feedbacks.id)}
                    >
                      Delete
                    </Button>
                  </td>
                )}
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

export default FeedbackRecived;
