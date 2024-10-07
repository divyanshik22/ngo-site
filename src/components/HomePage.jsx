import React from "react";
import { Carousel, Card, Row, Col, Container } from "react-bootstrap";
import Navbar from "./NavbarComponent";
import Footer from "./Footer";
import Aboutus from "./Aboutus";
import Animal from "../images/Animal";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "./Homepage.css";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";

const HomePage = ({ token, userType, handleToken, handleUser }) => {
  const customIcon = new Icon({
    iconUrl: require("../images/pin-map.png"),
    iconSize: [38, 38],
  });

  const markers = [
    {
      geocode: [23.393607, 76.132492],
      popUp: "Hello, I am pop up 1",
    },
    {
      geocode: [25.291267, 81.864672],
      popUp: "Hello, I am pop up 2",
    },
    {
      geocode: [23.215652, 83.996074],
      popUp: "Hello, I am pop up 3",
    },
  ];

  const feedbackData = [
    { text: "This organization is doing amazing work!", author: "John Doe" },
    {
      text: "I love helping animals through this platform.",
      author: "Jane Smith",
    },
    {
      text: "A great initiative for supporting the community.",
      author: "Alex Lee",
    },
    { text: "Very transparent and trustworthy.", author: "Maria Garcia" },
    {
      text: "They really care about making a difference.",
      author: "Tom Brown",
    },
    { text: "An excellent platform for donations.", author: "Sara White" },
  ];

  const groupedFeedback = [];
  for (let i = 0; i < feedbackData.length; i += 2) {
    groupedFeedback.push(feedbackData.slice(i, i + 2));
  }

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
      <Navbar token={token} handleToken={handleToken} handleUser={handleUser} />
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

      <Container style={{ padding: "20px" }}>
        <Row>
          <Col md={8}>
            <h3 className="text-center" style={{ marginBottom: "20px" }}>
              Nearby NGOs
            </h3>
            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={4}
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer
                url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg"
                maxZoom={20}
              />
              {markers.map((marker, index) => (
                <Marker key={index} position={marker.geocode} icon={customIcon}>
                  <Popup>{marker.popUp}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </Col>
          <Col md={4}>
            <h3>Feedback from Our Supporters</h3>
            <Carousel indicators={true} interval={4000}>
              {groupedFeedback.map((group, index) => (
                <Carousel.Item key={index}>
                  <Row>
                    {group.map((feedback, idx) => (
                      <Col key={idx} md={12} className="mb-3">
                        {" "}
                        {/* Stacked cards */}
                        <Card style={{ margin: "0 auto", width: "100%" }}>
                          <Card.Body>
                            <Card.Text>"{feedback.text}"</Card.Text>
                            <Card.Subtitle className="text-muted">
                              - {feedback.author}
                            </Card.Subtitle>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        </Row>
      </Container>

      <Aboutus />
      <Footer />
    </>
  );
};

export default HomePage;
