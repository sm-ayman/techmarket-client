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
      localStorage.setItem("techmarket_mock_admin", JSON.stringify(mockAdmin));
      return Promise.resolve(mockAdmin);
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
    return signOut(auth);
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
    const mockAdminStored = localStorage.getItem("techmarket_mock_admin");
    if (mockAdminStored) {
      const parsedAdmin = JSON.parse(mockAdminStored);
      setTimeout(() => {
        setUser(parsedAdmin);
        setLoading(false);
      }, 0);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
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
