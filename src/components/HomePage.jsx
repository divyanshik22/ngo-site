import React from "react";
import { Carousel, Card, Row, Col, Container } from "react-bootstrap";
import Navbar from "./NavbarComponent";
import Aboutus from "./Aboutus";
import Animal from "../images/Animal";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "./Homepage.css";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import line_1 from "../images/line_1.png";
import line_2 from "../images/line_2.png";
import line_3 from "../images/line_3.png";
import line_4 from "../images/line_4.png";
import line_5 from "../images/line_5.png";
import WorkDog from "../images/WorkDog.png";
import Pet1 from "../images/Pet1.jpeg";
import Pet2 from "../images/Pet2.jpeg";
import Pet3 from "../images/Pet3.jpeg";
import CardImage1 from "../images/CardImage1.jpeg";
import CardImage2 from "../images/CardImage2.jpeg";
import CardImage3 from "../images/CardImage3.jpeg";
import CardImage4 from "../images/CardImage4.jpeg";
import { FaHandHoldingMedical, FaClinicMedical, FaRegAddressCard, FaHospital, FaHome, FaPaw } from 'react-icons/fa';

const HomePage = ({
  token,
  userType,
  handleToken,
  handleUser,
  username,
  handleLogout,
}) => {
  const customIcon = new Icon({
    iconUrl: require("../images/pin-map.png"),
    iconSize: [38, 38],
  });

  const markers = [
    {
      geocode: [23.393607, 76.132492],
      popUp: "Ngo 1",
    },
    {
      geocode: [25.291267, 81.864672],
      popUp: "Ngo 2",
    },
    {
      geocode: [23.215652, 83.996074],
      popUp: "Ngo 3",
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
      title: "Rescue Stray Animals",
      text: "Help us rescue stray and injured animals to give them a safe shelter.",
      image: CardImage1, // Replace with actual path
    },
    {
      title: "Promote Pet Adoption",
      text: "Encourage adoption over buying. Give a homeless animal a loving home.",
      image: CardImage2, // Replace with actual path
    },
    {
      title: "Provide Medical Aid",
      text: "Support treatments, vaccinations, and surgeries for needy animals.",
      image: CardImage3, // Replace with actual path
    },
    {
      title: "Spread Awareness",
      text: "Educate people about animal rights, proper care, and compassion.",
      image: CardImage4, // Replace with actual path
    },
  ];


  const CardComponent = ({ data }) => (
    <div className="col-md-6 col-lg-3">
      <div className="card border-0 shadow-lg h-100 text-center p-4 hover-scale">
        <div className="card-body">
          {/* You can add content from `data` here */}
          <h5>{data.title}</h5>
          <p>{data.text}</p>
        </div>
      </div>
    </div>
  );

  const renderCards = (cardData) =>
    cardData.map((stat, index) => <CardComponent key={index} data={stat} />);
  return (
    <>
      <Navbar
        token={token}
        handleToken={handleToken}
        handleUser={handleUser}
        username={username}
        handleLogout={handleLogout}
      />
      <img
        src={Animal}
        alt="Logo"
        style={{ width: "100%", height: "auto" }}
        className="d-inline-block align-top"
      />
      <div>
        <Container style={{ padding: "20px", textAlign: "center" }}>
          <h2 style={{ color: "#DC5705" }}>Why Should You Help Us</h2>
          <p className="text-why-help">
            Your support can make a difference in the lives of those who need it
            the most. Whether it's providing shelter for animals or aiding people
            in crisis, every contribution counts. By helping us, you become a part
            of a compassionate community dedicated to making the world a better
            place.
          </p>
        </Container>
        <Container>
          <div className="row g-4">
            {cardData.map((card, index) => (
              <div className='col-md-6 col-lg-3'>
                <div className="card h-90" style={{ border: "2px solid #ffe7d3" }}>
                  <div style={{ height: "200px", overflow: "hidden" }}>
                    <img src={card.image} alt="CardImage1" className="img-fluid w-100 h-100" style={{ objectFit: "cover" }} />
                  </div>
                  <div className="card-body h-25">
                    <h3 style={{ color: "#D2691E" }}>{card.title}</h3>
                    <p style={{ color: "#D2691E" }}>{card.text}</p>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </Container>

        <div className="container py-5">
          <div className="row align-items-center">
            {/* Left Column: Text Content */}
            <div className="col-12 col-lg-6 mb-4">
              <div className="p-4 rounded" style={{ backgroundColor: "#ffe7d3" }}>
                <h1 className="text-center fw-bold" style={{ color: "#D2691E", fontSize: "2rem" }}>
                  Help stray animal
                </h1>
                <p className="fw-bold mt-4" style={{ color: "rgb(15, 100, 101)", fontSize: "1.2rem" }}>
                  You can help us adopt an animal by visiting our website and browsing through the list
                  of animals in need of a loving home. Once you find your perfect companion, simply fill
                  out the adoption form with basic details to ensure a great match. Our team will guide
                  you through the process, making it easy to welcome your new furry friend into your home.
                  Every adoption gives an animal a second chance at a happy life—be their hero today!
                </p>
                <div className="text-center mt-4">
                  <button
                    className="btn"
                    style={{
                      backgroundColor: "#D2691E",
                      color: "white",
                      padding: "0.5rem 1.5rem",
                      borderRadius: "20px",
                    }}
                  >
                    Adopt Now
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Images */}
            <div className="col-12 col-lg-6 gap-3 d-none d-md-block">
              <div className="row p-0 m-0">
                <div className="col-12 col-md-6">
                  <img src={Pet1} alt="Pet1" className="img-fluid" style={{ height: "70%", width: "100%" }} />
                  <div className="text-center mt-5">
                    <button
                      className="btn"
                      style={{
                        backgroundColor: "white",
                        border: "1px solid #D2691E",
                        color: "#D2691E",
                        padding: "0.5rem 1.5rem",
                        borderRadius: "20px",
                      }}
                    >
                      Donate Now
                    </button>
                  </div>
                </div>
                <div className="col-12 col-md-6 ">
                  <img src={Pet2} alt="Pet2" className="img-fluid" />
                  <img src={Pet3} alt="Pet3" className="img-fluid mt-5" />
                </div>
              </div>
            </div>
          </div>
        </div>



       <div className="holistic-approach">
        <div className="holistic-title">
          Volunteer Approach
        </div>
       <div
          
          style={{
            display: 'grid',
            gridTemplateRows: 'repeat(6, 1fr)',  // 6 equal-height rows
            gridTemplateColumns: 'repeat(6, 1fr)', // 3 columns
            textAlign: 'center'
          }}
        >
          <div className="step-card">
            <FaHandHoldingMedical className="step-icon" />
            <span className="step-text">Want to Help?</span>
          </div>
          <div className="step-card" style={{ gridRow: 2, gridColumn: 2 }}>
            <FaClinicMedical className="step-icon" />
            <span className="step-text">Login as Volunteer</span>

          </div>
          <div className="step-card" style={{ gridRow: 3, gridColumn: 3 }}>
            <FaRegAddressCard className="step-icon" />
            <span className="step-text">Update Your Location</span>
          </div>
          <div className="step-card" style={{ gridRow: 4, gridColumn: 4 }}>
            <FaHospital className="step-icon" />
            <span className="step-text">Rescue and Transport</span>
          </div>
          <div className="step-card" style={{ gridRow: 5, gridColumn: 5 }}>
            <FaHome className="step-icon" />
            <span className="step-text">Track and Update</span>
          </div>

          <div className="step-card" style={{ gridRow: 6, gridColumn: 6 }}>
            <FaPaw className="step-icon" />
            <span className="step-text">Stay Notified</span>
          </div>

        </div>
       </div>

        <div className="text-howWeWork">How We Work?</div>
        <div className="container-howWeWork">
          <p className="step step-1">
            Found an Animal? 🐶
          </p>
          <img
            src={line_1}
            className="step-image step-1-image d-none d-lg-block"
            alt="line_1"
          />
          <p className="step step-2" >
            Open the Website & Login 🔑💻
          </p>
          <img
            src={line_2}
            className="step-image step-2-image d-none d-lg-block"
            alt="line_2"
          />
          <p className="step step-3" >
            Enter the Details 📋✍
          </p>
          <img
            src={line_3}
            className="step-image step-3-image d-none d-lg-block"
            alt="line_3"
          />

          {/* Step 4 */}
          <p className="step step-4" >
            Nearest Volunteer Will Be Assigned 📍🚀
          </p>
          <img
            src={line_4}
            className="step-image step-4-image d-none d-lg-block"
            alt="line_4"
          />

          {/* Step 5 */}
          <p className="step step-5">
            They Will Take Care Now ❤️🐾
          </p>
          <img
            src={line_5}
            className="step-image step-5-image d-none d-lg-block"
            alt="line_5"
          />

          {/* Thank You Message */}
          <p className="step step-6">
            Thank You for Helping the Voiceless! 🙏💖
          </p>

          {/* Dog Image */}
          <img
            src={WorkDog}
            alt="Dog"
            className="dog-image"
          />
        </div>
      </div>
      <Aboutus />


    </>
  );
};

export default HomePage;
