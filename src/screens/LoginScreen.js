
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Please enter email and password.');
      return;
    }
    try {
      setError(null);
      setLoading(true);
      await login(email.trim(), password);
      // Navigation happens automatically via App.js (AuthContext listener)
    } catch (e) {
      const msg = e?.code;
      if (msg === 'auth/user-not-found' || msg === 'auth/wrong-password' || msg === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (msg === 'auth/too-many-requests') {
        setError('Too many attempts. Try again later.');
      } else {
        setError('Login failed. Check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconBadge}>
            <Text style={styles.iconText}>🏢</Text>
          </View>
          <Text style={styles.title}>Property Manager</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="#bbb"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#bbb"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />

          {/* Error */}
          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          )}

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.btn, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>Sign In</Text>
            }
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.registerLinkText}>
            Don't have an account? <Text style={{ fontWeight: '700', color: '#E62B4A' }}>Create Account</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen:    { flex: 1, backgroundColor: '#f5f6fa' },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 28 },

  header: { alignItems: 'center', marginBottom: 36 },
  iconBadge: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: '#E62B4A',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#E62B4A', shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 6,
  },
  iconText:  { fontSize: 34 },
  title:     { fontSize: 26, fontWeight: '800', color: '#1a1a1a', marginBottom: 4 },
  subtitle:  { fontSize: 14, color: '#888' },

  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000', shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 3,
  },
  label: { fontSize: 12, fontWeight: '700', color: '#555', marginBottom: 6, marginTop: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    borderWidth: 1.5, borderColor: '#e8e8e8', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: '#1a1a1a', backgroundColor: '#fafafa',
  },

  errorBox: {
    marginTop: 12, padding: 12,
    backgroundColor: '#FFF0F0', borderRadius: 8,
    borderLeftWidth: 4, borderLeftColor: '#E62B4A',
  },
  errorText: { fontSize: 13, color: '#C62828', fontWeight: '600' },

  btn: {
    backgroundColor: '#E62B4A', borderRadius: 12,
    paddingVertical: 15, alignItems: 'center', marginTop: 20,
    shadowColor: '#E62B4A', shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 4,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  registerLink: { marginTop: 24, alignItems: 'center' },
  registerLinkText: { fontSize: 14, color: '#888' },
});
