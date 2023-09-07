import firebase from 'firebase/compat/app';
import "firebase/compat/database";
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAyUuZ7oH8W59kzQDTgquP1Yj4kCVrMkNc",
  authDomain: "super-special-layout-generator.firebaseapp.com",
  projectId: "super-special-layout-generator",
  storageBucket: "super-special-layout-generator.appspot.com",
  messagingSenderId: "976149237124",
  appId: "1:976149237124:web:4c8f112d76f4d01969a1d1",
  measurementId: "G-W7WQ3SXKGL",
  databaseURL:
    "https://super-special-layout-generator-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

export const db = firebase.database(app);

export const getCurrentUser = () => firebase.auth().currentUser;
