import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";
import { log } from "./helper";
import Cookies from "js-cookie";
import "firebase/analytics";

const firebaseCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const firebaseApp = !firebase.apps.length
  ? firebase.initializeApp(firebaseCredentials)
  : firebase.app();
let analytics;
// Check if the user has given their consent
if (Cookies.get("myWebsiteCookieConsent") === "true") {
  // User has consented, you can use Firebase Analytics
  analytics = firebase.analytics();
} else {
  // User hasn't consented, don't use Firebase Analytics
  log("Firebase Analytics blocked due to cookie consent not given.");
}

export { firebase, firebaseApp, analytics }; // Export both firebase and firebaseApp
