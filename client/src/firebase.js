// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "mern-blog-713be.firebaseapp.com",
  projectId: "mern-blog-713be",
  storageBucket: "mern-blog-713be.appspot.com",
  messagingSenderId: "623815978094",
  appId: "1:623815978094:web:d8e025240110bcdece8a7f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);