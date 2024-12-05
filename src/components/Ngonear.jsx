import React, { useState } from "react";
import Navbar from "./NavbarComponent";
import LogIn from "./Login";
import { Modal, Form, Button, Row, Col, Container } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "./Homepage.css";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
const Ngonear = ({
  token,
  userType,
  handleToken,
  handleUser,
  username,
  handleLogout,
}) => {
  const [showSignup, setShowSignup] = useState(false);
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

  const handleClose = () => {
    setShowSignup(false);
  };

  const Signupbtn = () => {
    setShowSignup(true);
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
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg?apikey=1bdb70dc-0053-4aee-a0e7-fa4a9097a99f"
          maxZoom={20}
        />
        {markers.map((marker, index) => (
          <Marker key={index} position={marker.geocode} icon={customIcon}>
            <Popup>{marker.popUp}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
};
export default React.memo(Ngonear);
