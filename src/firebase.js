// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD2CWMyTrRx7NIOBuoAZItc3kqCTaVk9E8",
  authDomain: "utsaahcloud.firebaseapp.com",
  databaseURL: "https://utsaahcloud-default-rtdb.firebaseio.com",
  projectId: "utsaahcloud",
  storageBucket: "utsaahcloud.appspot.com",
  messagingSenderId: "910212835642",
  appId: "1:910212835642:web:3a45b6c6a398b070050803",
  measurementId: "G-818QJY803F",
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const logout = () => {
  signOut(auth);
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // Initialize Firestore with `firebase`
export const auth = getAuth(app); // Initialize Auth with `app`
export default app;

export { sendPasswordReset, logout };
