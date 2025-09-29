// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Helper: fetch role from Firestore
  const fetchUserRole = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        return userDoc.data().role || "staff";
      } else {
        console.warn("⚠️ User doc not found in Firestore → defaulting to staff");
        return "staff";
      }
    } catch (err) {
      console.error("❌ Error fetching user role:", err);
      return "staff";
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        const fetchedRole = await fetchUserRole(currentUser.uid);
        setRole(fetchedRole);
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Allow manual role refresh (useful after promoting user to admin)
  const refreshUserRole = async () => {
    if (user) {
      const fetchedRole = await fetchUserRole(user.uid);
      setRole(fetchedRole);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, refreshUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
