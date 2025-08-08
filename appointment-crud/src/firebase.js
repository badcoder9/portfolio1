// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAbYmTPlUkQSqEaEwVBxtwzutVGdN_78uU",
  authDomain: "testcursor1-63f16.firebaseapp.com",
  projectId: "testcursor1-63f16",
  storageBucket: "testcursor1-63f16.firebasestorage.app",
  messagingSenderId: "282826292532",
  appId: "1:282826292532:web:74951a78d73a8915ca3961",
  measurementId: "G-3DGTDBVYM0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);