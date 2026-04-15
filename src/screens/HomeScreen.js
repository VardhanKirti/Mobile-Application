
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Platform, StatusBar, TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const TILES = [
  {
    key: 'FS',
    label: 'FS',
    icon: 'store-outline',
    color: '#E62B4A',
    bg: '#FFF0F3',
  },
  {
    key: 'EBD',
    label: 'EBD',
    icon: 'storefront-outline',
    color: '#1a73e8',
    bg: '#EBF3FF',
  },
  {
    key: 'Warehouse',
    label: 'Warehouse',
    icon: 'warehouse',
    color: '#F57C00',
    bg: '#FFF3E0',
  },
  {
    key: 'Office',
    label: 'Office',
    icon: 'office-building-outline',
    color: '#2E7D32',
    bg: '#E8F5E9',
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
      <StatusBar barStyle="dark-content" backgroundColor="#f5f6fa" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ─────────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appBrand}>🏢 PropManager</Text>
            {isAdmin && <Text style={styles.adminChip}>Admin</Text>}
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.avatarCircle}>
            <MaterialIcons name="logout" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* ── Title ─────────────────────────────────────── */}
        <Text style={styles.pageTitle}>Property Lease Dashboard</Text>
        <Text style={styles.subtitle}>Select a property type to explore</Text>

        {/* ── Search Bar ────────────────────────────────── */}
        <View style={styles.searchWrapper}>
          <MaterialIcons name="search" size={20} color="#aaa" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search properties, cities, stores..."
            placeholderTextColor="#bbb"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
              <MaterialIcons name="close" size={16} color="#aaa" />
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
              <View style={[styles.iconCircle, { backgroundColor: tile.color + '22' }]}>
                <MaterialCommunityIcons
                  name={tile.icon}
                  size={32}
                  color={tile.color}
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
              {isAdmin ? '🔑 Admin' : '👤 Read-only user'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.signOutBtn}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <MaterialIcons name="logout" size={16} color="#E62B4A" style={{ marginRight: 4 }} />
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
    backgroundColor: '#f5f6fa',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0,
  },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  appBrand: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },
  adminChip: {
    fontSize: 10, fontWeight: '800', color: '#92400E',
    backgroundColor: '#FEF3C7', borderRadius: 4,
    paddingHorizontal: 6, paddingVertical: 2,
    alignSelf: 'flex-start', marginTop: 2,
    overflow: 'hidden',
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E62B4A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: { fontSize: 13, color: '#888', marginBottom: 18 },

  // ── Search Bar ───────────────────────────────────────
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1a1a1a',
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
    // Each tile takes ~half the width minus the gap in the middle
    width: '48%',
    borderRadius: 16,
    padding: 22,
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 3,
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
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 1,
  },
  userEmail: { fontSize: 13, fontWeight: '600', color: '#333' },
  userRole: { fontSize: 11, color: '#888', marginTop: 2 },
  signOutBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#FFF0F0', borderWidth: 1, borderColor: '#FFD0D0' },
  signOutText: { fontSize: 13, fontWeight: '700', color: '#E62B4A' },
});

