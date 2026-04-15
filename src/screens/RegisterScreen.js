
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  const handleRegister = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError('Please enter email and password.'); return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.'); return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }
    try {
      setLoading(true);
      await register(email.trim(), password, name.trim());
      // onAuthStateChanged in AuthContext handles redirect automatically
    } catch (e) {
      const code = e?.code;
      if (code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in.');
      } else if (code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else {
        setError('Registration failed. Please try again.');
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
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconBadge}>
            <Text style={styles.iconText}>🏢</Text>
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Register to access Property Manager</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Your name"
            placeholderTextColor="#bbb"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            returnKeyType="next"
          />

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
            placeholder="Min 6 characters"
            placeholderTextColor="#bbb"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            returnKeyType="next"
          />

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Re-enter password"
            placeholderTextColor="#bbb"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleRegister}
          />

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.btn, loading && { opacity: 0.7 }]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>Create Account</Text>
            }
          </TouchableOpacity>
        </View>

        {/* Back to login */}
        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.loginLinkText}>Already have an account? <Text style={{ fontWeight: '700', color: '#E62B4A' }}>Sign In</Text></Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen:    { flex: 1, backgroundColor: '#f5f6fa' },
  container: { padding: 28, paddingBottom: 48 },

  header: { alignItems: 'center', marginTop: 40, marginBottom: 32 },
  iconBadge: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: '#E62B4A', alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#E62B4A', shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 6,
  },
  iconText:  { fontSize: 34 },
  title:     { fontSize: 24, fontWeight: '800', color: '#1a1a1a', marginBottom: 4 },
  subtitle:  { fontSize: 14, color: '#888', textAlign: 'center' },

  form: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20,
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
    marginTop: 12, padding: 12, backgroundColor: '#FFF0F0',
    borderRadius: 8, borderLeftWidth: 4, borderLeftColor: '#E62B4A',
  },
  errorText: { fontSize: 13, color: '#C62828', fontWeight: '600' },

  btn: {
    backgroundColor: '#E62B4A', borderRadius: 12,
    paddingVertical: 15, alignItems: 'center', marginTop: 20,
    shadowColor: '#E62B4A', shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 4,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  loginLink: { marginTop: 24, alignItems: 'center' },
  loginLinkText: { fontSize: 14, color: '#888' },
});
