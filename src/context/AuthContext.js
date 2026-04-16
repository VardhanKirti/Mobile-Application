// src/context/AuthContext.js
// Provides: user, role, isAdmin, loading, googleLogin, logout

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';

const AuthContext = createContext(null);

// ── Admin Whitelist ───────────────────────────────────────────────────────
// Add email addresses here that should have full admin privileges.
// All other users will receive "viewer" (read-only) access by default.
const ADMIN_EMAILS = [
  'admin@example.com',
  'kirti.sharma@curefit.com',
  'anirban@curefit.com',
];

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [role,    setRole]    = useState(null);   // "admin" | "viewer"
  const [loading, setLoading] = useState(true);

  // ── Listen for auth state changes ─────────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Check if user is in admin whitelist
        const userEmail = firebaseUser.email?.toLowerCase();
        const isAdminEmail = ADMIN_EMAILS.includes(userEmail);
        const assignedRole = isAdminEmail ? 'admin' : 'viewer';
        
        setRole(assignedRole);

        // Optional: Sync with Firestore for tracking users
        try {
          const ref = doc(db, 'users', firebaseUser.uid);
          await setDoc(ref, {
            email: firebaseUser.email,
            name: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || '',
            role: assignedRole, // Store the assigned role
            lastLogin: new Date().toISOString(),
          }, { merge: true });
        } catch (_err) {
          console.log('[Auth] Could not sync user doc, continuing with local role');
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);


  // ── Auth Actions ─────────────────────────────────────────────────────────
  const googleLogin = async (idToken, isGuest = false) => {
    if (isGuest) {
      setUser({
        uid: 'guest-' + Math.random().toString(36).substr(2, 9),
        email: 'guest@example.com',
        displayName: 'Guest Viewer',
        isAnonymous: true,
      });
      setRole('viewer');
      return;
    }

    const credential = GoogleAuthProvider.credential(idToken);
    await signInWithCredential(auth, credential);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{
      user,
      role,
      isAdmin: role === 'admin',
      loading,
      googleLogin,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
