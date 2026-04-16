// Alternative: FirebaseUI-based Auth (No OAuth redirect URI issues)
// This uses Firebase's built-in auth which doesn't require Google Cloud Console setup

import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Image,
  ActivityIndicator, Alert, TextInput, KeyboardAvoidingView, Platform,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

// Import Cultfit logo
const cultfitLogo = require('../../cultfit.jpg');

// Admin whitelist
const ADMIN_EMAILS = [
  'kirti.sharma@curefit.com',
  'anirban@curefit.com',
  'admin@curefit.com',
];

export default function FirebaseAuthScreen() {
  const { googleLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // Check for redirect result on mount (for web)
  useEffect(() => {
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          await handlePostLogin(result.user);
        }
      } catch (e) {
        console.error('[Redirect Result Error]', e);
      }
    };
    checkRedirect();
  }, []);

  const handlePostLogin = async (firebaseUser) => {
    try {
      // Determine role based on email
      const userEmail = firebaseUser.email?.toLowerCase();
      const isAdmin = ADMIN_EMAILS.includes(userEmail);
      const role = isAdmin ? 'admin' : 'viewer';

      // Store user info in Firestore
      const ref = doc(db, 'users', firebaseUser.uid);
      await setDoc(ref, {
        email: firebaseUser.email,
        name: firebaseUser.displayName || '',
        photoURL: firebaseUser.photoURL || '',
        role: role,
        lastLogin: new Date().toISOString(),
      }, { merge: true });

      console.log(`[Auth] User ${userEmail} logged in as ${role}`);
    } catch (err) {
      console.error('[Post Login Error]', err);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      await handlePostLogin(userCredential.user);
    } catch (e) {
      console.error('[Email Auth Error]', e);
      let errorMessage = 'Authentication failed';
      
      switch (e.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'An account already exists with this email';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters';
          break;
        default:
          errorMessage = e.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      if (Platform.OS === 'web') {
        // Use popup for web
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        await handlePostLogin(result.user);
      } else {
        // For mobile, use the original Google auth
        await googleLogin();
      }
    } catch (e) {
      console.error('[Google Auth Error]', e);
      setError('Google sign-in failed. Please try email/password instead.');
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <Image source={cultfitLogo} style={styles.logo} resizeMode="contain" />
            <View style={styles.logoTextContainer}>
              <Text style={styles.logoTitle}>Cultfit</Text>
              <Text style={styles.logoSubtitle}>Properties</Text>
            </View>
          </View>

          {/* Auth Card */}
          <View style={styles.card}>
            <Text style={styles.welcomeText}>
              {isSignUp ? 'Create Account' : 'Welcome Back!'}
            </Text>
            <Text style={styles.infoText}>
              {isSignUp 
                ? 'Sign up to access the property dashboard. All new accounts get viewer access.'
                : 'Sign in to access the property dashboard.'
              }
            </Text>

            {/* Error Message */}
            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
              </View>
            )}

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            {/* Email Sign In/Up Button */}
            <TouchableOpacity
              style={[styles.authButton, loading && styles.buttonDisabled]}
              onPress={handleEmailAuth}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.authButtonText}>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Toggle Sign In/Up */}
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              disabled={loading}
            >
              <Text style={styles.toggleText}>
                {isSignUp 
                  ? 'Already have an account? Sign In' 
                  : "Don't have an account? Sign Up"
                }
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Sign In Button */}
            <TouchableOpacity
              style={[styles.googleButton, loading && styles.buttonDisabled]}
              onPress={handleGoogleSignIn}
              disabled={loading}
              activeOpacity={0.8}
            >
              <View style={styles.googleIconContainer}>
                <Text style={styles.googleIcon}>G</Text>
              </View>
              <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </TouchableOpacity>

            {/* Access Levels Info */}
            <View style={styles.roleInfo}>
              <Text style={styles.roleTitle}>ACCESS LEVELS:</Text>
              <View style={styles.roleRow}>
                <View style={[styles.roleBadge, styles.adminBadge]}>
                  <Text style={styles.adminBadgeText}>ADMIN</Text>
                </View>
                <Text style={styles.roleDescription}>Full CRUD (Whitelist only)</Text>
              </View>
              <View style={styles.roleRow}>
                <View style={[styles.roleBadge, styles.viewerBadge]}>
                  <Text style={styles.viewerBadgeText}>VIEWER</Text>
                </View>
                <Text style={styles.roleDescription}>Read-Only (All users)</Text>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Contact administrator for admin access
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
    borderRadius: 40,
  },
  logoTextContainer: {
    alignItems: 'center',
  },
  logoTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFD700',
    letterSpacing: 1,
  },
  logoSubtitle: {
    fontSize: 14,
    color: '#888888',
    marginTop: 4,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#333333',
    shadowColor: '#FFD700',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 20,
    elevation: 8,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#222222',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#444444',
  },
  errorBox: {
    backgroundColor: 'rgba(230, 43, 74, 0.15)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#E62B4A',
  },
  errorText: {
    fontSize: 13,
    color: '#E62B4A',
    fontWeight: '600',
  },
  authButton: {
    backgroundColor: '#FFD700',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#FFD700',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  authButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
  toggleButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  toggleText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333333',
  },
  dividerText: {
    color: '#666666',
    fontSize: 12,
    marginHorizontal: 12,
    fontWeight: '600',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  googleIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  googleButtonText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '600',
  },
  roleInfo: {
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  roleTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFD700',
    marginBottom: 12,
    letterSpacing: 1,
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
  },
  adminBadge: {
    backgroundColor: '#FFD700',
  },
  adminBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#000000',
  },
  viewerBadge: {
    backgroundColor: '#444444',
  },
  viewerBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  roleDescription: {
    fontSize: 12,
    color: '#AAAAAA',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666666',
  },
});
