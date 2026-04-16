import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Image,
  ActivityIndicator, KeyboardAvoidingView, Platform,
  Alert
} from 'react-native';
import { useAuth } from '../context/AuthContext';

// Native Google Sign In
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Web Google Sign In
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

// Import Cultfit logo
const cultfitLogo = require('../../cultfit.jpg');

WebBrowser.maybeCompleteAuthSession();

export default function GoogleAuthScreen() {
  const { googleLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const WEB_CLIENT_ID = '680180840921-bf7fdo87i3secg5dbkris5uhkfj7ped8.apps.googleusercontent.com';

  // 🌐 Web Auth Hook
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: WEB_CLIENT_ID,
  });

  // 📱 Initialize Native Auth
  useEffect(() => {
    if (Platform.OS !== 'web') {
      GoogleSignin.configure({
        webClientId: WEB_CLIENT_ID,
        offlineAccess: true,
      });
    }
  }, []);

  // 🌐 Handle Web Response
  useEffect(() => {
    if (Platform.OS === 'web' && response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleLogin(id_token);
    }
  }, [response]);

  const handleGoogleLogin = async (idToken) => {
    try {
      setLoading(true);
      setError(null);
      await googleLogin(idToken);
    } catch (e) {
      console.error('[Firebase Login Error]', e);
      setError('Firebase failed to verify token.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      if (Platform.OS === 'web') {
        // --- Web Flow ---
        await promptAsync();
      } else {
        // --- Native Flow (APK) ---
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        const idToken = userInfo.data.idToken;
        await handleGoogleLogin(idToken);
      }
    } catch (e) {
      console.error('[Google Sign-In Error]', e);
      setError(`Login failed: ${e.message}`);
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        {/* Cultfit Logo */}
        <View style={styles.logoContainer}>
          <Image source={cultfitLogo} style={styles.logo} resizeMode="contain" />
        </View>

        {/* Title Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Cultfit Properties</Text>
          <Text style={styles.subtitle}>Property Management Dashboard</Text>
        </View>

        {/* Auth Card */}
        <View style={styles.card}>
          <Text style={styles.welcomeText}>Official Access</Text>
          <Text style={styles.infoText}>
            Sign in with your official Google account to access real-time property data.
          </Text>

          {/* Error Message */}
          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          )}

          {/* Native Google Sign In Button */}
          <TouchableOpacity
            style={[styles.googleButton, loading && styles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <View style={styles.googleIconContainer}>
                  <Text style={styles.googleIcon}>G</Text>
                </View>
                <Text style={styles.googleButtonText}>Sign in with Google</Text>
              </>
            )}
          </TouchableOpacity>
ity>

          {/* Role Info */}
          <View style={styles.roleInfoContainer}>
            <Text style={styles.roleInfoTitle}>Access Levels:</Text>
            <View style={styles.roleRow}>
              <View style={[styles.roleBadge, styles.adminBadge]}>
                <Text style={styles.adminBadgeText}>ADMIN</Text>
              </View>
              <Text style={styles.roleDescription}>Full Control (Whitelist only)</Text>
            </View>
            <View style={styles.roleRow}>
              <View style={[styles.roleBadge, styles.viewerBadge]}>
                <Text style={styles.viewerBadgeText}>VIEWER</Text>
              </View>
              <Text style={styles.roleDescription}>Read-Only (Global access)</Text>
            </View>
          </View>
        </View>


        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Contact your administrator to request admin access
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#AAAAAA',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#FFD700',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  debugBox: {
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#FFD700',
  },
  debugTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFD700',
    marginBottom: 4,
  },
  debugText: {
    fontSize: 10,
    color: '#AAAAAA',
    marginBottom: 6,
  },
  debugUrl: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
    backgroundColor: '#000000',
    padding: 8,
    borderRadius: 6,
  },
  debugHint: {
    fontSize: 9,
    color: '#FFD700',
    marginTop: 6,
    fontStyle: 'italic',
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
  buttonDisabled: {
    opacity: 0.6,
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
  guestButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  guestButtonText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  roleInfoContainer: {

    borderTopWidth: 1,
    borderTopColor: '#333333',
    paddingTop: 20,
  },
  roleInfoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFD700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 12,
  },
  adminBadge: {
    backgroundColor: '#FFD700',
  },
  viewerBadge: {
    backgroundColor: '#444444',
  },
  adminBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#000000',
  },
  viewerBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  roleDescription: {
    fontSize: 13,
    color: '#AAAAAA',
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
});
