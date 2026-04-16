
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Platform, StatusBar, TextInput, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

// Cultfit Logo
const cultfitLogo = require('../../cultfit.jpg');

const TILES = [
  {
    key: 'FS',
    label: 'FS',
    icon: 'store-outline',
    color: '#FFD700',
    bg: '#1A1A1A',
  },
  {
    key: 'EBD',
    label: 'EBD',
    icon: 'storefront-outline',
    color: '#FFD700',
    bg: '#1A1A1A',
  },
  {
    key: 'Warehouse',
    label: 'Warehouse',
    icon: 'warehouse',
    color: '#FFD700',
    bg: '#1A1A1A',
  },
  {
    key: 'Office',
    label: 'Office',
    icon: 'office-building-outline',
    color: '#FFD700',
    bg: '#1A1A1A',
  },
];

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAdmin, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error('Logout failed:', e);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Cultfit Logo Header ─────────────────────────────────────── */}
        <View style={styles.logoHeader}>
          <Image source={cultfitLogo} style={styles.logo} resizeMode="contain" />
          <View style={styles.logoTextContainer}>
            <Text style={styles.logoTitle}>Cultfit</Text>
            <Text style={styles.logoSubtitle}>Properties</Text>
          </View>
          {isAdmin && (
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>ADMIN</Text>
            </View>
          )}
        </View>

        {/* ── Header ─────────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appBrand}>🏢 Property Manager</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.avatarCircle}>
            <MaterialIcons name="logout" size={18} color="#000" />
          </TouchableOpacity>
        </View>

        {/* ── Title ─────────────────────────────────────── */}
        <Text style={styles.pageTitle}>Property Lease Dashboard</Text>
        <Text style={styles.subtitle}>Select a property type to explore</Text>

        {/* ── Search Bar ────────────────────────────────── */}
        <View style={styles.searchWrapper}>
          <MaterialIcons name="search" size={20} color="#FFD700" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search properties, cities, stores..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
              <MaterialIcons name="close" size={16} color="#FFD700" />
            </TouchableOpacity>
          )}
        </View>

        {/* ── 2×2 Tile Grid ─────────────────────────────── */}
        <View style={styles.grid}>
          {TILES.map((tile, index) => (
            <TouchableOpacity
              key={tile.key}
              style={[
                styles.tile,
                { backgroundColor: tile.bg },
                index % 2 === 0 ? { marginRight: 12 } : {},
              ]}
              onPress={() =>
                navigation.navigate('Dashboard', { propertyType: tile.key })
              }
              activeOpacity={0.8}
            >
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(255, 215, 0, 0.15)' }]}>
                <MaterialCommunityIcons
                  name={tile.icon}
                  size={32}
                  color="#FFD700"
                />
              </View>
              <Text style={[styles.tileLabel, { color: tile.color }]}>{tile.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── User info + Sign out ────────────────────────── */}
        <View style={styles.userCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.userEmail} numberOfLines={1}>
              {user?.email}
            </Text>
            <Text style={styles.userRole}>
              {isAdmin ? '🔑 Admin Access' : '👤 Read-only Access'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.signOutBtn}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <MaterialIcons name="logout" size={16} color="#FFD700" style={{ marginRight: 4 }} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0,
  },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },

  // ── Logo Header ────────────────────────────────────
  logoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  logoTextContainer: {
    marginLeft: 12,
  },
  logoTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  logoSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFD700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  adminBadge: {
    marginLeft: 'auto',
    backgroundColor: '#FFD700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  adminBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#000000',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  appBrand: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },

  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },

  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: { fontSize: 13, color: '#888888', marginBottom: 18 },

  // ── Search Bar ───────────────────────────────────────
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    marginBottom: 24,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    padding: 0,
    margin: 0,
  },
  clearBtn: { padding: 4 },

  // ── Grid ─────────────────────────────────────────────
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tile: {
    width: '48%',
    borderRadius: 16,
    padding: 22,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#333333',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  tileLabel: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },

  // ── User card at bottom ───────────────────────────────
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    padding: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
  userEmail: { fontSize: 13, fontWeight: '600', color: '#FFFFFF' },
  userRole: { fontSize: 11, color: '#888888', marginTop: 2 },
  signOutBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 8, 
    backgroundColor: 'rgba(255, 215, 0, 0.1)', 
    borderWidth: 1, 
    borderColor: '#FFD700' 
  },
  signOutText: { fontSize: 13, fontWeight: '700', color: '#FFD700' },
});

