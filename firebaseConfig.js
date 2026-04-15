// firebaseConfig.js — Firebase 12.x compatible, works on iOS/Android/Web

import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
};

// ── Init app (safe for hot-reload) ────────────────────────────────────────────
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ── Firestore ─────────────────────────────────────────────────────────────────
let db;
try {
  db = initializeFirestore(app, {
    experimentalForceLongPolling: Platform.OS !== "web",
  });
} catch {
  db = getFirestore(app);
}

// ── Auth ──────────────────────────────────────────────────────────────────────
// In Firebase 12.x the simple getAuth() works reliably for both web and native.
// The session persists automatically via the SDK's built-in storage layer.
const auth = getAuth(app);

export { db, auth };
