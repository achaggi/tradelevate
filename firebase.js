// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrsqwDeGjMcfExVixiTDCEOhzmt5mBC54",
  authDomain: "tradelevate-10fe1.firebaseapp.com",
  projectId: "tradelevate-10fe1",
  storageBucket: "tradelevate-10fe1.firebasestorage.app",
  messagingSenderId: "573698316645",
  appId: "1:573698316645:web:0104dfff5eaa440f47698c",
  measurementId: "G-XRWQ4SQHXT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Google Sign-In Function
async function googleLogin() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Store user in Firestore
    await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        portfolios: []
    }, { merge: true });

    console.log("User signed in:", user);
}

document.getElementById("login-btn").addEventListener("click", googleLogin);
