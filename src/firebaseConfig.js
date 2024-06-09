// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDoACpzTptr1-Yjd4t58_8hN03bc9xzl0g",
  authDomain: "connect-mvp-ace2e.firebaseapp.com",
  projectId: "connect-mvp-ace2e",
  storageBucket: "connect-mvp-ace2e.appspot.com",
  messagingSenderId: "154485172376",
  appId: "1:154485172376:web:777b069742b728872848ed",
  measurementId: "G-XV95RS0PWF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
// const geofirestore = new GeoFirestore(firestore);

export { auth, app, firestore, storage};
