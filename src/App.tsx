import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { useEffect } from "react";

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
