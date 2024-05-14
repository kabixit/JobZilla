// firebaseConfig.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: "AIzaSyA_n54KYpXAsudDyQTELVJOOklYSjmYE0s",
    authDomain: "jobzillla.firebaseapp.com",
    projectId: "jobzillla",
    storageBucket: "jobzillla.appspot.com",
    messagingSenderId: "710603800549",
    appId: "1:710603800549:web:eec2e4dbda2047011e390c",
    measurementId: "G-FT4DM9QEC1"
  };
  

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export {app, analytics, auth, db};