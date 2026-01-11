// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyDeMGfEFb-L8bNNti55LhjphvFKnsNot9s",
  authDomain: "ai-trip-planner-f8fa3.firebaseapp.com",
  projectId: "ai-trip-planner-f8fa3",
  storageBucket: "ai-trip-planner-f8fa3.firebasestorage.app",
  messagingSenderId: "241868259480",
  appId: "1:241868259480:web:1eca499f52301f84a2d0ed",
  measurementId: "G-J1CYJQRWLY"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
//export const analytics = getAnalytics(app);
export const db = getFirestore(app);