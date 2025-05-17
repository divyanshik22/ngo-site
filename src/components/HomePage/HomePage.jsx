import React, { useEffect, useState } from "react";
import { Carousel, Card, Row, Col, Container } from "react-bootstrap";
import Navbar from "../Navbar/NavbarComponent";
import Aboutus from "../About/Aboutus";
import Animal from "../../images/Animal";
import { Link, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "./Homepage.css";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import line_1 from "../../images/line_1.png";
import line_2 from "../../images/line_2.png";
import line_3 from "../../images/line_3.png";
import line_4 from "../../images/line_4.png";
import line_5 from "../../images/line_5.png";
import WorkDog from "../../images/WorkDog.png";
import Pet1 from "../../images/Pet1.jpeg";
import Pet2 from "../../images/Pet2.jpeg";
import Pet3 from "../../images/Pet3.jpeg";
import CardImage1 from "../../images/CardImage1.jpeg";
import CardImage2 from "../../images/CardImage2.jpeg";
import CardImage3 from "../../images/CardImage3.jpeg";
import CardImage4 from "../../images/CardImage4.jpeg";
import { FaHandHoldingMedical, FaClinicMedical, FaRegAddressCard, FaHospital, FaHome, FaPaw, FaHeart, FaUsers, FaHandshake, FaStar, FaDog, FaCat, FaPlay } from 'react-icons/fa';

const HomePage = ({
  token,
  userType,
  handleToken,
  handleUser,
  username,
  handleLogout,
}) => {
  const [stats, setStats] = useState({
    animalsRescued: 0,
    volunteers: 0,
    donations: 0,
    happyAdoptions: 0
  });

  useEffect(() => {
    // Animate stats counting up
    const targetStats = {
      animalsRescued: 5000,
      volunteers: 1000,
      donations: 2500,
      happyAdoptions: 3000
    };

    const duration = 2000; // 2 seconds
    const steps = 50;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setStats({
        animalsRescued: Math.floor(targetStats.animalsRescued * progress),
        volunteers: Math.floor(targetStats.volunteers * progress),
        donations: Math.floor(targetStats.donations * progress),
        happyAdoptions: Math.floor(targetStats.happyAdoptions * progress)
      });

      if (currentStep === steps) clearInterval(interval);
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  const customIcon = new Icon({
    iconUrl: require("../../images/pin-map.png"),
    iconSize: [38, 38],
  });
  const navigate = useNavigate();
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
      <div className="hero-section">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-rescued-dog-being-cared-for-by-veterinarian-1486-large.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Help Dogs in Need</h1>
          <p className="hero-subtitle">Join us in rescuing and caring for stray dogs</p>
          <div className="hero-buttons">
            <button 
              className="btn btn-primary hero-btn"
              onClick={() => navigate("/donate")}
            >
              <FaHeart className="me-2" /> Donate Now
            </button>
            <button 
              className="btn btn-outline-primary hero-btn"
              onClick={() => navigate("/helpneeded")}
            >
              <FaPaw className="me-2" /> Help Dogs
            </button>
          </div>
        </div>
        <div className="floating-elements">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="floating-element"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
                backgroundImage: i % 2 === 0 
                  ? 'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23D2691E\'><path d=\'M12 2C9.24 2 7 4.24 7 7c0 2.85 2.92 7.21 5 9.88 2.11-2.69 5-7 5-9.88 0-2.76-2.24-5-5-5zm0 7.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z\'/></svg>")'
                  : 'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%230F6465\'><path d=\'M12 2C9.24 2 7 4.24 7 7c0 2.85 2.92 7.21 5 9.88 2.11-2.69 5-7 5-9.88 0-2.76-2.24-5-5-5zm0 7.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z\'/></svg>")'
              }}
            />
          ))}
        </div>
      </div>
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
        {/* New Statistics Section */}
      <div className="stats-section py-5" style={{ backgroundColor: "#ffe7d3" }}>
        <Container>
          <h2 className="text-center mb-5" style={{ color: "#D2691E" }}>Our Impact in Numbers</h2>
          <Row className="g-4">
            <Col md={3} className="text-center">
              <div className="stat-card">
                <FaPaw className="stat-icon" style={{ color: "#D2691E", fontSize: "2.5rem" }} />
                <h3 className="stat-number">{stats.animalsRescued}+</h3>
                <p className="stat-label">Animals Rescued</p>
              </div>
            </Col>
            <Col md={3} className="text-center">
              <div className="stat-card">
                <FaUsers className="stat-icon" style={{ color: "#D2691E", fontSize: "2.5rem" }} />
                <h3 className="stat-number">{stats.volunteers}+</h3>
                <p className="stat-label">Active Volunteers</p>
              </div>
            </Col>
            <Col md={3} className="text-center">
              <div className="stat-card">
                <FaHandshake className="stat-icon" style={{ color: "#D2691E", fontSize: "2.5rem" }} />
                <h3 className="stat-number">{stats.donations}+</h3>
                <p className="stat-label">Donations Received</p>
              </div>
            </Col>
            <Col md={3} className="text-center">
              <div className="stat-card">
                <FaHeart className="stat-icon" style={{ color: "#D2691E", fontSize: "2.5rem" }} />
                <h3 className="stat-number">{stats.happyAdoptions}+</h3>
                <p className="stat-label">Happy Adoptions</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

        <Container>
          <div className="row g-4">
            {cardData.map((card, index) => (
              <div className='col-md-6 col-lg-3' key={index}>
                <div className="card h-90" style={{ border: "2px solid #ffe7d3" }}>
                  <div style={{ height: "200px", overflow: "hidden" }}>
                    <img src={card.image} alt="CardImage1" className="img-fluid w-100 h-100" style={{ objectFit: "cover" }} />
                  </div>
                  <div className="card-body h-25">
                    <h2 style={{ color: "#D2691E" }}>{card.title}</h2>
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
                <h2 className="text-center" style={{ color: "#D2691E" }}>
                  Help stray animal
                </h2>
                <p className="fw-bold mt-4" style={{ color: "rgb(15, 100, 101)" }}>
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
                      onClick={()=>{navigate("/donate")}}
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



       <div >
        <div className="holistic-title">
          Volunteer Approach
        </div>
       <div
          className="holistic-approach"
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
