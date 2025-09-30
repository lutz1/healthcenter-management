import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

// AuthProvider wraps the app and provides currentUser and loading state
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // includes role
  const [loading, setLoading] = useState(true);

  // Fetch Firestore user document by uid
  const fetchUserData = async (uid) => {
    try {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        return { uid, ...snap.data() }; // includes role
      }
      console.warn("No Firestore user doc for uid:", uid);
      return null;
    } catch (err) {
      console.error("fetchUserData error:", err);
      return null;
    }
  };

  useEffect(() => {
    // Listen to Firebase Auth changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);

      if (user) {
        console.log("Auth state changed - user:", user.uid, user.email);
        const userData = await fetchUserData(user.uid);

        // Merge Firebase Auth user object with Firestore role
        setCurrentUser(
          userData
            ? { uid: user.uid, email: user.email, role: userData.role || "staff" }
            : null
        );
      } else {
        setCurrentUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access AuthContext
export const useAuth = () => useContext(AuthContext);