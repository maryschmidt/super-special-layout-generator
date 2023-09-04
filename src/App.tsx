import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'firebaseui/dist/firebaseui.css'

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
  databaseURL: "https://super-special-layout-generator-default.rtdb.firebaseio.com",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);
// Initialize the FirebaseUI Widget using Firebase.
const ui = new firebaseui.auth.AuthUI(firebase.auth());

ui.start('#firebaseui-auth-container', {
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
});

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Super Special Layout Generator</h1>
      <div id="firebaseui-auth-container" />
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </>
  )
}

export default App
