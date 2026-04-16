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


export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [role,    setRole]    = useState(null);   // "admin" | "viewer"
  const [loading, setLoading] = useState(true);

  // ── Listen for auth state changes ─────────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        try {
          // Default to viewer while checking
          setRole('viewer');
          
          const adminRef = doc(db, 'app_config', 'admins');
          const adminSnap = await getDoc(adminRef);
          
          if (adminSnap.exists()) {
            const data = adminSnap.data();
            const userEmail = firebaseUser.email?.toLowerCase().trim();
            const rawEmails = data.emails || [];
            
            const adminList = Array.isArray(rawEmails) ? rawEmails : [rawEmails];
            const lowerCaseAdmins = adminList.map(e => String(e).toLowerCase().trim());
            
            if (lowerCaseAdmins.includes(userEmail)) {
              setRole('admin');
              console.log('[Auth] Logged in as ADMIN:', userEmail);
            } else {
              console.log('[Auth] Logged in as VIEWER:', userEmail);
            }
          }


          // Sync user profile
          const userRef = doc(db, 'users', firebaseUser.uid);
          await setDoc(userRef, {
            email: firebaseUser.email,
            name: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || '',
            role: assignedRole,
            lastLogin: new Date().toISOString(),
          }, { merge: true });

        } catch (e) {
          console.error('[Auth] Error syncing role:', e);
          setRole('viewer'); // Fail safe to viewer
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
