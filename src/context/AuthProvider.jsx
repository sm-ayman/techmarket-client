"use client";

import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { auth } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Sign in
  const loginUser = (email, password) => {
    setLoading(true);
    if (email === "admin@techmarket.com" && password === "admin123") {
      const mockAdmin = {
        uid: "admin-super-id",
        email: "admin@techmarket.com",
        displayName: "Admin User",
        photoURL: null,
        role: "admin"
      };
      setUser(mockAdmin);
      setLoading(false);
      localStorage.setItem("techmarket_mock_user", JSON.stringify(mockAdmin));
      return Promise.resolve(mockAdmin);
    }
    if (email === "customer@techmarket.com" && password === "customer123") {
      const mockCustomer = {
        uid: "customer-demo-id",
        email: "customer@techmarket.com",
        displayName: "Demo Customer",
        photoURL: null,
        role: "customer"
      };
      setUser(mockCustomer);
      setLoading(false);
      localStorage.setItem("techmarket_mock_user", JSON.stringify(mockCustomer));
      return Promise.resolve(mockCustomer);
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google sign in
  const loginWithGoogle = () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  // Log out
  const logoutUser = () => {
    setLoading(true);
    localStorage.removeItem("techmarket_mock_admin");
    localStorage.removeItem("techmarket_mock_user");
    return signOut(auth).then(() => {
      setUser(null);
      setLoading(false);
    });
  };

  // Update profile
  const updateUserProfile = (name, photoURL) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoURL
    }).then(() => {
      // Update state manually to sync
      setUser({ ...auth.currentUser });
    });
  };

  // Observe user auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const mockUserStored = localStorage.getItem("techmarket_mock_user") || localStorage.getItem("techmarket_mock_admin");
      if (mockUserStored) {
        setUser(JSON.parse(mockUserStored));
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    loginUser,
    loginWithGoogle,
    logoutUser,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
