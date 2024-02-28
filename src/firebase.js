import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDlBJY88-bj8aRTSETMpgCV7GCsujbmcrA",
  authDomain: "bestonlinedealz-18a9c.firebaseapp.com",
  projectId: "bestonlinedealz-18a9c",
  storageBucket: "bestonlinedealz-18a9c.appspot.com",
  messagingSenderId: "484368364257",
  appId: "1:484368364257:web:74edd536eb7e2c3800fda0",
  measurementId: "G-ZNK2K7G8TX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
