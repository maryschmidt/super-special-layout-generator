import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { useEffect } from "react";

// Import the functions you need from the SDKs you need
// import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAyUuZ7oH8W59kzQDTgquP1Yj4kCVrMkNc",
  authDomain: "super-special-layout-generator.firebaseapp.com",
  projectId: "super-special-layout-generator",
  storageBucket: "super-special-layout-generator.appspot.com",
  messagingSenderId: "976149237124",
  appId: "1:976149237124:web:4c8f112d76f4d01969a1d1",
  measurementId: "G-W7WQ3SXKGL",
  databaseURL:
    "https://super-special-layout-generator-default.rtdb.firebaseio.com",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);
// Initialize the FirebaseUI Widget using Firebase.
const ui = new firebaseui.auth.AuthUI(firebase.auth());

function App() {
  // This function needs to be called after the div has been rendered
  useEffect(() => {
    ui.start("#firebaseui-auth-container", {
      signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
      signInSuccessUrl: "/layout",
    });
  }, []);

  return (
    <Container
      sx={{
        display: "flex",
        minWidth: "420px",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h1">Super Special Layout Generator</Typography>
      <div id="firebaseui-auth-container" />
    </Container>
  );
}

export default App;
