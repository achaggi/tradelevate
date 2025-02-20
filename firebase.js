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

async function googleLogin() {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
}

    // Store user in Firestore
    await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        portfolios: []
    }, { merge: true });

    console.log("User signed in:", user);
    loadUserPortfolios();  // Load portfolios after login
}

// Function to Create a Portfolio
async function createPortfolio() {
    const user = auth.currentUser;
    if (!user) return alert("Please log in first!");

    const portfolioName = prompt("Enter Portfolio Name:");
    const startingAmount = parseFloat(prompt("Enter Starting Amount:"));

    if (!portfolioName || isNaN(startingAmount)) return alert("Invalid input!");

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
        portfolios: arrayUnion({ name: portfolioName, balance: startingAmount })
    });

    alert("Portfolio Created!");
    loadUserPortfolios();  // Refresh the list
}

// Function to Load User Portfolios
async function loadUserPortfolios() {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userData = (await getDoc(userRef)).data();

    const portfolioList = document.getElementById("portfolio-list");
    portfolioList.innerHTML = ""; // Clear previous data

    userData.portfolios.forEach(portfolio => {
        const div = document.createElement("div");
        div.innerHTML = `<h3>${portfolio.name} - $${portfolio.balance}</h3>`;
        portfolioList.appendChild(div);
    });
}

// Attach Functions to Buttons
document.getElementById("login-btn").addEventListener("click", googleLogin);
document.getElementById("create-portfolio-btn").addEventListener("click", createPortfolio);
auth.onAuthStateChanged(user => {
    if (user) loadUserPortfolios();
});

// Function to Edit Portfolio
async function editPortfolio(portfolioName) {
    const user = auth.currentUser;
    if (!user) return alert("Please log in first!");

    const newBalance = parseFloat(prompt(`Enter new balance for ${portfolioName}:`));
    if (isNaN(newBalance)) return alert("Invalid input!");

    const userRef = doc(db, "users", user.uid);
    const userData = (await getDoc(userRef)).data();

    // Find and update the portfolio
    const updatedPortfolios = userData.portfolios.map(p =>
        p.name === portfolioName ? { ...p, balance: newBalance } : p
    );

    await setDoc(userRef, { portfolios: updatedPortfolios }, { merge: true });

    alert("Portfolio Updated!");
    loadUserPortfolios();
}

// Function to Delete Portfolio
async function deletePortfolio(portfolioName) {
    const user = auth.currentUser;
    if (!user) return alert("Please log in first!");

    if (!confirm(`Are you sure you want to delete ${portfolioName}?`)) return;

    const userRef = doc(db, "users", user.uid");
    const userData = (await getDoc(userRef)).data();

    // Remove the selected portfolio
    const updatedPortfolios = userData.portfolios.filter(p => p.name !== portfolioName);

    await setDoc(userRef, { portfolios: updatedPortfolios }, { merge: true });

    alert("Portfolio Deleted!");
    loadUserPortfolios();
}

// Function to Load User Portfolios (Now Includes Edit & Delete)
async function loadUserPortfolios() {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userData = (await getDoc(userRef)).data();

    const portfolioList = document.getElementById("portfolio-list");
    portfolioList.innerHTML = ""; // Clear previous data

    userData.portfolios.forEach(portfolio => {
        const div = document.createElement("div");
        div.innerHTML = `
            <h3>${portfolio.name} - $${portfolio.balance}</h3>
            <button onclick="editPortfolio('${portfolio.name}')">Edit</button>
            <button onclick="deletePortfolio('${portfolio.name}')">Delete</button>
        `;
        portfolioList.appendChild(div);
    });
}

// Attach Functions to Buttons
document.getElementById("login-btn").addEventListener("click", googleLogin);
document.getElementById("create-portfolio-btn").addEventListener("click", createPortfolio);
auth.onAuthStateChanged(user => {
    if (user) loadUserPortfolios();
});

// Expose edit/delete to global scope
window.editPortfolio = editPortfolio;
window.deletePortfolio = deletePortfolio;
