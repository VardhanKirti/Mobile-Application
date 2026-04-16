// firebaseConfig.js — Firebase 12.x compatible, works on iOS/Android/Web

import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore, getFirestore } from "firebase/firestore";
import { 
  getAuth, 
  initializeAuth, 
  getReactNativePersistence 
} from "firebase/auth";
import { Platform } from "react-native";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDu3cXJk7MUPyZPqaFkk605VOcro7dKSko",
  authDomain: "testing-anirban.firebaseapp.com",
  projectId: "testing-anirban",
  storageBucket: "testing-anirban.firebasestorage.app",
  messagingSenderId: "680180840921",
  appId: "1:680180840921:web:85d7ac5c49a0a4416b41c8",
  measurementId: "G-438TPE1XMS"
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

let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
}

export { db, auth };

