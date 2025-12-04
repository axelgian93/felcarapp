import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCaXsnT65fiNp60adIJgDL7e-KC9BiLxtY",
  authDomain: "felcar-app.firebaseapp.com",
  projectId: "felcar-app",
  storageBucket: "felcar-app.firebasestorage.app",
  messagingSenderId: "285880772552",
  appId: "1:285880772552:web:ad190b7110b255aae7c2fd",
  measurementId: "G-H2GP3J01LW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Helper to check initialization
export const isFirebaseInitialized = !!app;