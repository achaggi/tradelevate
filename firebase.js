import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, signInWithRedirect, GoogleAuthProvider, getRedirectResult } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
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

// Google Sign-In Function (Redirect-based to fix COOP error)
async function googleLogin() {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
}

// Handle login after redirect
async function handleRedirectResult() {
    const result = await getRedirectResult(auth);
    if (result) {
        const user = result.user;

        // ✅ FIXED: No syntax error here
        await setDoc(doc(db, "users", user.uid), {
            name: user.displayName,
            email: user.email,
            portfolios: []
        }, { merge: true });

        console.log("User signed in:", user);
    }
}

// Run on page load
handleRedirectResult();

document.getElementById("login-btn").addEventListener("click", googleLogin);
