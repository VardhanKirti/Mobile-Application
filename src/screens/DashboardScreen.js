
import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DashboardHeader from '../components/DashboardHeader';
import Dropdown from '../components/Dropdown';
import SummaryCard from '../components/SummaryCard';
import {
  getFSProductTypes,
  getFSBusinessTypes,
  getFSCities,
  getFSStores,
  getEBOCities,
  getEBOStores,
  diagnoseProperties,
  getRawSampleDocument,
} from '../data/propertyService';
import { useAuth } from '../context/AuthContext';

// ── Accent colours ────────────────────────────────────────────────────────────
const COLOR = { FS: '#E62B4A', EBO: '#1a73e8' };

export default function DashboardScreen({ route, navigation }) {
  const { propertyType } = route.params;
  const accent = COLOR[propertyType] || '#333';
  const isFS   = propertyType === 'FS';
  const { isAdmin } = useAuth();

  // ── Filter state ──────────────────────────────────────────────────────────
  const [productType,   setProductType]   = useState(null);   // FS only
  const [businessType,  setBusinessType]  = useState(null);   // FS only
  const [city,          setCity]          = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [storeSearch,   setStoreSearch]   = useState('');

  // ── Firestore data ────────────────────────────────────────────────────────
  const [productTypes,  setProductTypes]  = useState([]);
  const [businessTypes, setBusinessTypes] = useState([]);
  const [cities,        setCities]        = useState([]);
  const [stores,        setStores]        = useState([]);
  const [rawSample,     setRawSample]     = useState(null);

  // ── Loading / error ───────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const wrap = async (fn) => {
    try {
      setLoading(true);
      setError(null);
      await fn();
    } catch (e) {
      const msg = e?.message || String(e);
      console.error('[Dashboard]', msg);
      setError(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  // ── On mount: diagnostic + Step 1 ────────────────────────────────────────
  useEffect(() => {
    diagnoseProperties();
    getRawSampleDocument().then(r => { if (r) setRawSample(r); });

    // Step 1 — fetch first-level options
    if (isFS) {
      wrap(async () => {
        const data = await getFSProductTypes();
        setProductTypes(data);
      });
    } else {
      // EBO: jump straight to cities
      wrap(async () => {
        const data = await getEBOCities();
        setCities(data);
      });
    }
  }, []);

  // ── Step 2 (FS): business_type when product_type selected ─────────────────
  useEffect(() => {
    if (!isFS || !productType) return;
    wrap(async () => {
      const data = await getFSBusinessTypes(productType);
      setBusinessTypes(data);
    });
  }, [productType]);

  // ── Step 3 (FS): cities when business_type selected ───────────────────────
  useEffect(() => {
    if (!isFS || !businessType) return;
    wrap(async () => {
      const data = await getFSCities(productType, businessType);
      setCities(data);
    });
  }, [businessType]);

  // ── Step 4: stores when city selected ─────────────────────────────────────
  useEffect(() => {
    if (!city) return;
    wrap(async () => {
      const data = isFS
        ? await getFSStores(productType, businessType, city)
        : await getEBOStores(city);
      setStores(data);
    });
  }, [city]);

  // ── Reset helpers ─────────────────────────────────────────────────────────
  const handleProductType = (val) => {
    setProductType(val);
    setBusinessType(null); setBusinessTypes([]);
    setCity(null);         setCities([]);
    setStores([]);         setSelectedStore(null); setStoreSearch('');
  };
  const handleBusinessType = (val) => {
    setBusinessType(val);
    setCity(null); setCities([]);
    setStores([]); setSelectedStore(null); setStoreSearch('');
  };
  const handleCity = (val) => {
    setCity(val);
    setStores([]); setSelectedStore(null); setStoreSearch('');
  };

  // ── Navigate to detail screen on store tap ──────────────────────
  const handleStoreTap = (store) => {
    navigation.navigate('StoreDetail', { store, accentColor: accent });
  };

  // ── Filtered stores ───────────────────────────────────────────────────────
  const filteredStores = useMemo(() => {
    if (!storeSearch.trim()) return stores;
    return stores.filter(s =>
      (s.name || '').toLowerCase().includes(storeSearch.toLowerCase())
    );
  }, [stores, storeSearch]);

  // ── Detail card ───────────────────────────────────────────────────────────
  const renderSummary = () => {
    if (!selectedStore) return null;
    return (
      <SummaryCard
        title="Store Details"
        accentColor={accent}
        rows={[
          { label: 'Site Name',       value: selectedStore.name ?? '—' },
          { label: 'City',            value: selectedStore.city ?? '—' },
          { label: 'Product Type',    value: selectedStore.product_type ?? '—' },
          { label: 'Business Type',   value: selectedStore.business_type ?? '—' },
          { label: 'Store Type',      value: selectedStore.store_type ?? '—' },
          { label: 'Floor',           value: selectedStore.floor ?? '—' },
          { label: 'Launch Year',     value: String(selectedStore.launch_year ?? '—') },
          { label: 'Cost / Sq Ft',    value: selectedStore.cost_per_sqft ? `₹${selectedStore.cost_per_sqft}` : '—' },
          { label: 'Monthly Rent',    value: selectedStore.monthly_rent ? `₹${Number(selectedStore.monthly_rent).toLocaleString()}` : '—' },
          { label: 'Total Sq Ft',     value: selectedStore.total_sqft ? `${Number(selectedStore.total_sqft).toLocaleString()}` : '—' },
          { label: 'Escalation %',    value: selectedStore.escalation_percent ? `${selectedStore.escalation_percent}%` : '—' },
          { label: 'Contract End',    value: selectedStore.contract_end ?? '—' },
          { label: 'Next Escalation', value: selectedStore.next_escalation_date ?? '—' },
          { label: 'Lock-in Status',  value: selectedStore.lockin_status ?? '—' },
        ]}
      />
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <View style={styles.screen}>
      <DashboardHeader title={`${propertyType} Dashboard`} showBack />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>

          {/* Loading */}
          {loading && (
            <ActivityIndicator color={accent} style={{ marginVertical: 14 }} />
          )}

          {/* Error */}
          {!!error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorTitle}>⚠️ {error}</Text>
              <Text style={styles.errorHint}>
                Check Firestore rules (allow read: if true) and composite indexes.
              </Text>
            </View>
          )}

          {/* ── FS STEP 1: product_type ───────────────────────── */}
          {!loading && !error && isFS && productTypes.length > 0 && (
            <View style={styles.row}>
              <Dropdown
                label="Product Type"
                options={productTypes}
                value={productType}
                onChange={handleProductType}
              />
            </View>
          )}

          {/* ── FS STEP 2: business_type ──────────────────────── */}
          {!loading && isFS && productType && businessTypes.length > 0 && (
            <View style={styles.row}>
              <Text style={styles.sectionLabel}>Business Type</Text>
              <View style={styles.toggleRow}>
                {businessTypes.map(bt => (
                  <TouchableOpacity
                    key={bt}
                    onPress={() => handleBusinessType(bt)}
                    style={[
                      styles.toggleBtn,
                      businessType === bt && { backgroundColor: accent, borderColor: accent },
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.toggleText, businessType === bt && { color: '#fff', fontWeight: '700' }]}>
                      {bt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* ── CITY (FS: after business_type; EBO: first step) ── */}
          {!loading && cities.length > 0 && (!isFS || businessType) && (
            <View style={styles.row}>
              <Dropdown
                label="Select City"
                options={cities}
                value={city}
                onChange={handleCity}
                highlighted={!!city}
              />
            </View>
          )}

          {/* ── STORE LIST ────────────────────────────────────── */}
          {city && !loading && (
            <View style={styles.row}>
              {/* Search */}
              <View style={styles.searchBox}>
                <MaterialIcons name="search" size={18} color="#999" style={{ marginRight: 6 }} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search store name..."
                  placeholderTextColor="#bbb"
                  value={storeSearch}
                  onChangeText={setStoreSearch}
                />
                {storeSearch.length > 0 && (
                  <TouchableOpacity onPress={() => setStoreSearch('')}>
                    <MaterialIcons name="close" size={16} color="#999" />
                  </TouchableOpacity>
                )}
              </View>

              {filteredStores.length === 0 ? (
                <Text style={styles.emptyText}>No stores found for this selection.</Text>
              ) : (
                filteredStores.map(store => (
                  <TouchableOpacity
                    key={store.id}
                    style={styles.storeItem}
                    onPress={() => handleStoreTap(store)}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.storeText}>{store.name}</Text>
                    <MaterialIcons name="chevron-right" size={18} color="#bbb" />
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}

          {/* ── Empty state ───────────────────────────────────── */}
          {!loading && !error && isFS && productTypes.length === 0 && (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>No FS data found</Text>
              <Text style={styles.emptyHint}>Query: store_type == "FS"</Text>
              {rawSample && (
                <Text style={[styles.emptyHint, { color: '#E62B4A', marginTop: 6 }]}>
                  Your fields: {rawSample.fieldNames?.join(', ')}
                </Text>
              )}
            </View>
          )}

          {!loading && !error && !isFS && cities.length === 0 && (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>No EBO data found</Text>
              <Text style={styles.emptyHint}>Query: store_type == "EBO"</Text>
              {rawSample && (
                <Text style={[styles.emptyHint, { color: '#E62B4A', marginTop: 6 }]}>
                  Your fields: {rawSample.fieldNames?.join(', ')}
                </Text>
              )}
            </View>
          )}
        </View>

      </ScrollView>

      {/* ── Admin FAB: Add Store ─────────────────────────── */}
      {isAdmin && (
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: accent }]}
          onPress={() => navigation.navigate('AddEditStore', {})}
          activeOpacity={0.85}
        >
          <MaterialIcons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f5f6fa' },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 100 }, // extra bottom for FAB

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 12,
  },
  row: { marginBottom: 12 },

  sectionLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  toggleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  toggleBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  toggleText: { fontSize: 14, color: '#444', fontWeight: '600' },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  searchInput: { flex: 1, fontSize: 14, color: '#1a1a1a', paddingVertical: 0 },

  storeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
    marginBottom: 2,
  },
  storeText: { fontSize: 14, color: '#333', flex: 1 },
  emptyText: { fontSize: 13, color: '#aaa', textAlign: 'center', paddingVertical: 20 },

  errorBox: {
    backgroundColor: '#FFF0F0',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#E62B4A',
    padding: 14,
    marginBottom: 10,
  },
  errorTitle: { fontSize: 14, fontWeight: '700', color: '#C62828', marginBottom: 4 },
  errorHint:  { fontSize: 12, color: '#888' },

  emptyBox: {
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: '#555', marginBottom: 6 },
  emptyHint:  { fontSize: 12, color: '#999', textAlign: 'center' },
});
