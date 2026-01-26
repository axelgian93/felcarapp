
// Using compat imports to resolve "no exported member" errors in environment
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

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
const app = firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();

// Helper to check initialization
export const isFirebaseInitialized = !!app;
