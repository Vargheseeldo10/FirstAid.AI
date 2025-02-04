import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
 // Import the functions you need from the SDKs you need

  apiKey: "AIzaSyAsKLxAzdt_Wf3CyoUCE4izrSdNh50SLto",
  authDomain: "firstaid-ai-4a1fd.firebaseapp.com",
  projectId: "firstaid-ai-4a1fd",
  storageBucket: "firstaid-ai-4a1fd.firebasestorage.app",
  messagingSenderId: "407902398252",
  appId: "1:407902398252:web:a51757f1b013738eb2ae89",
  measurementId: "G-G8DVPBMB94"


};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email, password) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}