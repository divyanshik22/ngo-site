import React from "react";
import { Carousel, Card, Row, Col, Container } from "react-bootstrap";
import Navbar from "./NavbarComponent";
import Footer from "./Footer";
import Aboutus from "./Aboutus";
import Animal from "../images/Animal";
import "./Homepage.css";

const HomePage = ({ token, handleToken }) => {
  const cardData = [
    {
      title: "Support Animals",
      text: "Help provide shelter and care for animals in need.",
    },
    {
      title: "Aid People in Crisis",
      text: "Assist people facing difficult situations with your contributions.",
    },
    {
      title: "Environmental Protection",
      text: "Join us in protecting our environment and natural resources.",
    },
    {
      title: "Education for All",
      text: "Support education initiatives for underprivileged children.",
    },
    {
      title: "Healthcare Access",
      text: "Ensure healthcare access for vulnerable communities.",
    },
    {
      title: "Empowering Women",
      text: "Contribute to empowering women through various programs.",
    },
    {
      title: "Fighting Hunger",
      text: "Join us in the fight against hunger and food insecurity.",
    },
    {
      title: "Community Development",
      text: "Support the development of sustainable communities.",
    },
  ];

  const renderCards = (cards) => {
    return cards.map((card, index) => (
      <Col key={index} md={3}>
        <Card style={{ margin: "10px" }}>
          <Card.Body>
            <Card.Title>{card.title}</Card.Title>
            <Card.Text>{card.text}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
    ));
  };

  return (
    <>
      <Navbar token={token} handleToken={handleToken} />
      <img
        src={Animal}
        alt="Logo"
        style={{ width: "100%", height: "auto" }}
        className="d-inline-block align-top"
      />
      <Container style={{ padding: "20px", textAlign: "center" }}>
        <h2>Why Should You Help Us</h2>
        <p>
          Your support can make a difference in the lives of those who need it
          the most. Whether it's providing shelter for animals or aiding people
          in crisis, every contribution counts. By helping us, you become a part
          of a compassionate community dedicated to making the world a better
          place.
        </p>
        <div className="custom-carousel">
          <Carousel indicators={false} interval={3000}>
            <Carousel.Item>
              <Row>{renderCards(cardData.slice(0, 4))}</Row>
            </Carousel.Item>
            <Carousel.Item>
              <Row>{renderCards(cardData.slice(4, 8))}</Row>
            </Carousel.Item>
          </Carousel>
        </div>
      </Container>
      <Aboutus />
      <Footer />
    </>
  );
};

export default HomePage;
