// src/context/AuthContext.js
// Provides: user, role, isAdmin, loading, login, logout

import React, { createContext, useContext, useEffect, useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [role,    setRole]    = useState(null);   // "admin" | "user"
  const [loading, setLoading] = useState(true);

  // ── Listen for auth state changes ─────────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const ref  = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            setRole(snap.data().role ?? 'user');
          } else {
            // First login — try to create user doc (may fail if rules block it)
            try {
              await setDoc(ref, { email: firebaseUser.email, role: 'user' });
            } catch (_writeErr) {
              // Rules block non-admins from writing — silently ignore, default to 'user'
              console.log('[Auth] Could not create user doc (non-admin), defaulting to user role');
            }
            setRole('user');
          }
        } catch (e) {
          // Firestore read failed — default to 'user' so login still works
          console.warn('[Auth] Could not fetch user role:', e.message);
          setRole('user');
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  // ── Auth actions ──────────────────────────────────────────────────────────
  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email, password, name = '') => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    // Try to create user doc — may silently fail if rules block it
    try {
      await setDoc(doc(db, 'users', cred.user.uid), {
        email,
        name,
        role: 'user',
      });
    } catch (_) {}
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, role, isAdmin: role === 'admin', loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
