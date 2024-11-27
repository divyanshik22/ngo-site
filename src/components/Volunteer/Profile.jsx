import React, { useState, useEffect, useRef } from "react";
import Navbar from "./NavbarVol";
import { db } from "../../firebase"; // Firebase import
import { doc, updateDoc, collection, getDocs } from "firebase/firestore"; // Firebase Firestore imports
import { useSelector } from "react-redux";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const Profile = ({ token, handleToken }) => {
  const [profile, setProfile] = useState({
    id: "",
    firstName: "",
    lastName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    postcode: "",
    state: "",
    area: "",
    email: "",
    location: "",
    country: "",
    region: "",
    active: false, // New field for active status
  });

  const [isEditing, setIsEditing] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const email = useSelector((state) => state.user.currentUser?.email); // Get email from Redux state
  const mapRef = useRef();

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error fetching geolocation:", error);
        }
      );
    }

    // Fetch the volunteer profile
    const fetchVolunteer = async () => {
      if (!email) return; // If there's no email, stop fetching

      try {
        const querySnapshot = await getDocs(collection(db, "Users"));
        const volunteersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter to get only the logged-in user's information
        const loggedInUserVolunteer = volunteersList.find(
          (vol) => vol.email === email
        );

        if (loggedInUserVolunteer) {
          setProfile({
            id: loggedInUserVolunteer.id || "",
            firstName: loggedInUserVolunteer.firstName || "",
            lastName: loggedInUserVolunteer.lastName || "",
            phone: loggedInUserVolunteer.phone || "",
            addressLine1: loggedInUserVolunteer.addressLine1 || "",
            addressLine2: loggedInUserVolunteer.addressLine2 || "",
            postcode: loggedInUserVolunteer.postcode || "",
            state: loggedInUserVolunteer.state || "",
            area: loggedInUserVolunteer.area || "",
            email: loggedInUserVolunteer.email || "",
            location: loggedInUserVolunteer.location || "",
            country: loggedInUserVolunteer.country || "",
            region: loggedInUserVolunteer.region || "",
            active: loggedInUserVolunteer.active || false, // Adding the active status
          });
          setAddress(loggedInUserVolunteer.location || "");
        }
      } catch (error) {
        console.error("Error fetching volunteer data:", error);
      }
    };

    fetchVolunteer(); // Trigger the fetch once the email is available
  }, [email]); // Only rerun when `email` changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      // Update profile with new location if available
      const updatedProfile = {
        ...profile,
        location: address || profile.location, // Save the selected address
      };

      const userRef = doc(db, "Users", profile.id); // Ensure profile has an `id`
      await updateDoc(userRef, updatedProfile);
      console.log("Profile updated successfully:", updatedProfile);
      setIsEditing(false); // Disable editing mode after saving
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const toggleActiveStatus = () => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      active: !prevProfile.active, // Toggle the active status
    }));
  };

  const getAddress = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      setAddress(response.data.display_name);
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const LocationMap = () => {
    const map = useMapEvents({
      click(e) {
        if (isEditing) {
          const { lat, lng } = e.latlng;
          setSelectedLocation({ lat, lng });
          getAddress(lat, lng);
          map.flyTo(e.latlng, map.getZoom());
        }
      },
    });

    return selectedLocation ? (
      <Marker position={selectedLocation}>
        <Popup>{address}</Popup>
      </Marker>
    ) : null;
  };

  L.Marker.prototype.options.icon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <>
      <Navbar token={token} />
      <div className="container rounded bg-white mt-5 mb-5">
        <div className="row">
          <div className="col-md-3 border-right">
            <div className="d-flex flex-column align-items-center text-center p-3 py-5">
              <img
                className="rounded-circle mt-5"
                width="150px"
                src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                alt="Profile"
              />
              <span className="font-weight-bold">
                {profile.firstName} {profile.lastName}
              </span>
              <span className="text-black-50">{profile.email}</span>
            </div>
          </div>
          <div className="col-md-8 border-right">
            <div className="p-3 py-5">
              <h4 className="text-center">Profile</h4>
              <div className="row mt-2">
                <div className="col-md-6">
                  <label className="labels">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="col-md-6">
                  <label className="labels">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-12">
                  <label className="labels">Mobile Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="col-md-12">
                  <label className="labels">Address Line 1</label>
                  <input
                    type="text"
                    className="form-control"
                    name="addressLine1"
                    value={profile.addressLine1}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="col-md-12">
                  <label className="labels">Email ID</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    disabled
                  />
                </div>
                <div className="col-md-12">
                  <label className="labels">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    name="location"
                    value={address || profile.location}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              {/* Toggle active status */}
              <div className="mt-3">
                <label className="labels">Active</label>
                <input
                  type="checkbox"
                  checked={profile.active}
                  onChange={toggleActiveStatus}
                  data-toggle="toggle"
                  data-on="Ready"
                  data-off="Not Ready"
                  data-onstyle="success"
                  data-offstyle="danger"
                  disabled={!isEditing}
                  className="custom-toggle"
                />
              </div>
              <div className="mt-5 text-center">
                <button
                  className="btn btn-primary profile-button"
                  type="button"
                  onClick={
                    isEditing ? handleSaveProfile : () => setIsEditing(true)
                  }
                >
                  {isEditing ? "Save Profile" : "Edit Profile"}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-md-12">
            <MapContainer
              center={userLocation || [51.505, -0.09]} // Center to current location if available
              zoom={13}
              style={{ height: "400px", width: "100%" }}
              ref={mapRef}
              dragging={isEditing}
              touchZoom={isEditing}
              scrollWheelZoom={isEditing}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMap />
            </MapContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
