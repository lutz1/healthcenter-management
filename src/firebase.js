// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ✅ Replace these with your HealthCenter project config
const firebaseConfig = {
  apiKey: "AIzaSyAxnLA6nWGpuwA7FxJksdDsJL8lNB29iBM",
  authDomain: "healthcenter-61826.firebaseapp.com",
  projectId: "healthcenter-61826",
  storageBucket: "healthcenter-61826.firebasestorage.app",
  messagingSenderId: "469079304917",
  appId: "1:469079304917:web:283b2b86b4b409d85ed05c"
};

// ✅ Initialize main app
export const app = initializeApp(firebaseConfig);

// ✅ Main instances
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// ✅ Secondary app for creating users (doesn’t log out the current admin)
export const secondaryApp = initializeApp(firebaseConfig, "Secondary");
export const secondaryAuth = getAuth(secondaryApp);