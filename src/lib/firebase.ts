// Firebase Configuration
// To set up Firebase:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project (or use existing)
// 3. Add a web app to your project
// 4. Enable Authentication > Email/Password
// 5. Enable Firestore Database
// 6. Copy your config and paste below

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your Firebase config
// You can find this in: Project Settings > General > Your apps > Firebase SDK snippet
const firebaseConfig = {
  apiKey: "AIzaSyAllT8uxN-kz7ZFbl-Gc4-GAp0z_ejbokM",
  authDomain: "intern-track-8db04.firebaseapp.com",
  projectId: "intern-track-8db04",
  storageBucket: "intern-track-8db04.firebasestorage.app",
  messagingSenderId: "542477493733",
  appId: "1:542477493733:web:5bfd3ed411bef15af83b0c",
  measurementId: "G-WZH29GE5FB"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
