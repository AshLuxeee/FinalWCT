import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCITVGdvXyMXnKCa7OIJBjEsd4vApcSTjI",
  authDomain: "ashluxe-a9432.firebaseapp.com",
  projectId: "ashluxe-a9432",
  storageBucket: "ashluxe-a9432.firebasestorage.app",
  messagingSenderId: "515569093923",
  appId: "1:515569093923:web:79c8427cae26b6343a9096"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
