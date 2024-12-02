import React, { useState, useEffect, useRef } from "react";
import Navbar from "./NavbarVol";
import { db } from "../../firebase"; // Firebase import
import { doc, updateDoc, collection, getDocs } from "firebase/firestore";
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

const Profile = ({ token }) => {
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
    lat: null, // Latitude
    lng: null,
    country: "",
    region: "",
    active: false, // Active status
  });

  const [isEditing, setIsEditing] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [address, setAddress] = useState("");
  const email = useSelector((state) => state.user.currentUser?.email); // Redux for email
  const [showMap, setShowMap] = useState(false); // New state to control map visibility

  const mapRef = useRef();
  const handleLocateMe = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const address = await getAddressFromLatLng(latitude, longitude);
        setSelectedLocation({ lat: latitude, lng: longitude });
        setAddress(address);
        setShowMap(true); // Show map after fetching location
      },
      (error) => console.error("Error getting location:", error),
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    // Fetch volunteer data
    const fetchVolunteer = async () => {
      if (!email) return;

      try {
        const querySnapshot = await getDocs(collection(db, "Users"));
        const volunteersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const loggedInUser = volunteersList.find((vol) => vol.email === email);
        if (loggedInUser) {
          setProfile({
            id: loggedInUser.id || "",
            firstName: loggedInUser.firstName || "",
            lastName: loggedInUser.lastName || "",
            phone: loggedInUser.phone || "",
            addressLine1: loggedInUser.addressLine1 || "",
            addressLine2: loggedInUser.addressLine2 || "",
            postcode: loggedInUser.postcode || "",
            state: loggedInUser.state || "",
            area: loggedInUser.area || "",
            email: loggedInUser.email || "",
            location: loggedInUser.location || "",
            country: loggedInUser.country || "",
            region: loggedInUser.region || "",
            active: loggedInUser.active || false,
          });
          setAddress(loggedInUser.location || "");
        }
      } catch (error) {
        console.error("Error fetching volunteer data:", error);
      }
    };

    fetchVolunteer();
  }, [email]);

  const handleSaveProfile = async () => {
    try {
      const updatedProfile = {
        ...profile,
        location: address || profile.location,
        lat: selectedLocation?.lat || profile.lat, // Save latitude
        lng: selectedLocation?.lng || profile.lng, // Save longitude
      };

      const userRef = doc(db, "Users", profile.id);
      await updateDoc(userRef, updatedProfile);
      console.log("Profile updated successfully:", updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const getAddressFromLatLng = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      return response.data.display_name;
    } catch (error) {
      console.error("Error fetching address:", error);
      return "";
    }
  };

  const LocationMap = () => {
    const map = useMapEvents({
      click: async (e) => {
        if (isEditing) {
          const { lat, lng } = e.latlng;
          const address = await getAddressFromLatLng(lat, lng);
          setSelectedLocation({ lat, lng });
          setAddress(address);
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
                    onChange={(e) =>
                      setProfile({ ...profile, firstName: e.target.value })
                    }
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
                    onChange={(e) =>
                      setProfile({ ...profile, lastName: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-12">
                  <label className="labels">Mobile</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="col-md-12">
                  <label className="labels">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={profile.email}
                    disabled
                  />
                </div>
                <div className="col-md-12">
                  <label className="labels">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    value={address}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div>
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={handleLocateMe}
                  disabled={!isEditing}
                >
                  Locate Me
                </button>
                {showMap && (
                  <div className="row mt-5">
                    <div className="col-md-12">
                      <MapContainer
                        center={
                          selectedLocation
                            ? [selectedLocation.lat, selectedLocation.lng]
                            : [51.505, -0.09]
                        }
                        zoom={13}
                        style={{ height: "400px", width: "100%" }}
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {selectedLocation && (
                          <Marker position={selectedLocation}>
                            <Popup>{address}</Popup>
                          </Marker>
                        )}
                      </MapContainer>
                    </div>
                  </div>
                )}
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
      </div>
    </>
  );
};

export default Profile;
