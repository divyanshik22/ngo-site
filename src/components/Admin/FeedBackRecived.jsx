import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";

const FeedBackRecived = () => {
  const [userDetails, setUserDetails] = useState(null);
  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      console.log(user);
      const docRef = doc(db, "Feedback");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserDetails(docSnap.data());
        console.log(docSnap.data());
      } else {
        console.log("Data");
      }
    });
  };
  useEffect(() => {
    fetchUserData();
  }, []);
  return <>{userDetails ? <p>{userDetails.email}</p> : ""}</>;
};
export default FeedBackRecived;
