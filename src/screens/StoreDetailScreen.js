
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, Image, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DashboardHeader from '../components/DashboardHeader';
import { useAuth } from '../context/AuthContext';
import { deleteProperty } from '../data/propertyService';

// ── Rows to display ───────────────────────────────────────────────────────────
const ROWS = [
  { label: 'Store Name',       field: 'name' },
  { label: 'City',             field: 'city' },
  { label: 'Store Type',       field: 'store_type' },
  { label: 'Product Type',     field: 'product_type' },
  { label: 'Business Type',    field: 'business_type' },
  { label: 'Floor',            field: 'floor' },
  { label: 'Launch Year',      field: 'launch_year' },
  { label: 'Cost / Sq Ft (₹)', field: 'cost_per_sqft',          currency: true },
  { label: 'Monthly Rent (₹)', field: 'monthly_rent',           currency: true },
  { label: 'Total Sq Ft',      field: 'total_sqft',             number: true },
  { label: 'Escalation %',     field: 'escalation_percent',     suffix: '%' },
  { label: 'Escalation Cycle', field: 'escalation_cycle' },
  { label: 'Security Deposit', field: 'security_deposit_months', suffix: ' months' },
  { label: 'Lock-in Status',   field: 'lockin_status' },
  { label: 'Contract End',     field: 'contract_end' },
  { label: 'Next Escalation',  field: 'next_escalation_date' },
];

const fmt = (val, { currency, number, suffix } = {}) => {
  if (val === null || val === undefined || val === '') return '—';
  if (currency || number) return Number(val).toLocaleString('en-IN') + (suffix ?? '');
  return String(val) + (suffix ?? '');
};

export default function StoreDetailScreen({ route, navigation }) {
  const { store: initialStore, accentColor = '#E62B4A' } = route.params;
  const [store, setStore] = useState(initialStore);
  const { isAdmin } = useAuth();
  const [deleting,       setDeleting]       = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleteError,    setDeleteError]    = useState(null);

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    try {
      setDeleting(true);
      setDeleteError(null);
      await deleteProperty(store.id);
      navigation.goBack();
    } catch (e) {
      console.error('[Delete failed]', e?.code, e?.message);
      setDeleteError(`Delete failed: ${e?.message ?? e?.code ?? 'Unknown error'}`);
      setConfirmVisible(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <DashboardHeader title="Store Details" showBack />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Name badge ─────────────────────────────────── */}
        <View style={[styles.badge, { borderLeftColor: accentColor }]}>
          <Text style={[styles.badgeName, { color: accentColor }]}>{store.name ?? 'Store'}</Text>
          <Text style={styles.badgeSub}>
            {[store.store_type, store.product_type, store.business_type, store.city]
              .filter(Boolean).join(' · ')}
          </Text>

          {/* Admin role badge */}
          {isAdmin && (
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>🔑 Admin View</Text>
            </View>
          )}
        </View>

        {/* ── Image Gallery ──────────────────────────────────── */}
        {Array.isArray(store.site_images) && store.site_images.length > 0 && (
          <View style={styles.gallerySection}>
            <Text style={styles.sectionLabel}>🖼️  Site Photos</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.galleryScroll}
              contentContainerStyle={{ paddingRight: 16 }}
            >
              {store.site_images.map((uri, idx) => (
                <Image
                  key={idx}
                  source={{ uri }}
                  style={styles.galleryImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* ── Map Location button ─────────────────────────────── */}
        {!!store.site_location && (
          <TouchableOpacity
            style={styles.mapBtn}
            onPress={() => Linking.openURL(store.site_location).catch(() => {})}
            activeOpacity={0.8}
          >
            <Text style={styles.mapBtnText}>🗺️  View Map Location</Text>
          </TouchableOpacity>
        )}

        {/* ── Detail rows ─────────────────────────────────── */}
        <View style={styles.card}>
          {ROWS.map(({ label, field, ...opts }, i) => {
            const raw = store[field];
            if (raw === null || raw === undefined || raw === '') return null;
            return (
              <View key={field} style={[styles.row, i % 2 === 0 && styles.rowAlt]}>
                <Text style={styles.rowLabel}>{label}</Text>
                <Text style={styles.rowValue}>{fmt(raw, opts)}</Text>
              </View>
            );
          })}
        </View>

        {/* ── Admin actions (write access only) ─────────────────────────────── */}
        {isAdmin && (
          <View style={styles.adminActions}>
            <Text style={styles.adminTitle}>Admin Actions</Text>

            <View style={styles.actionRow}>
              {/* Edit */}
              <TouchableOpacity
                style={[styles.editBtn, { flex: 1, marginRight: 8 }]}
                onPress={() => navigation.navigate('AddEditStore', { store })}
                activeOpacity={0.8}
              >
                <Text style={styles.editBtnText}>✏️  Edit</Text>
              </TouchableOpacity>

              {/* Delete — tap → shows inline confirm */}
              {!confirmVisible ? (
                <TouchableOpacity
                  style={[styles.deleteBtn, { flex: 1 }]}
                  onPress={() => setConfirmVisible(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.deleteBtnText}>🗑  Delete</Text>
                </TouchableOpacity>
              ) : (
                <View style={{ flex: 1 }}>
                  <Text style={styles.confirmText}>Are you sure?</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                      style={[styles.cancelBtn, { flex: 1, marginRight: 6 }]}
                      onPress={() => setConfirmVisible(false)}
                    >
                      <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.deleteBtn, { flex: 1 }, deleting && { opacity: 0.6 }]}
                      onPress={handleDelete}
                      disabled={deleting}
                    >
                      {deleting
                        ? <ActivityIndicator color="#fff" size="small" />
                        : <Text style={styles.deleteBtnText}>Confirm</Text>
                      }
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {/* Delete error */}
            {deleteError && (
              <View style={styles.deleteError}>
                <Text style={styles.deleteErrorText}>{deleteError}</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: '#f5f6fa' },
  scroll:  { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },

  badge: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderLeftWidth: 5,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  badgeName: { fontSize: 20, fontWeight: '800', marginBottom: 4 },
  badgeSub:  { fontSize: 13, color: '#888' },

  adminBadge: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#FFF3CD',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#FBBF24',
  },
  adminBadgeText: { fontSize: 12, color: '#92400E', fontWeight: '700' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  row:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1, borderColor: '#f2f2f2' },
  rowAlt:   { backgroundColor: '#fafafa' },
  rowLabel: { fontSize: 13, color: '#888', flex: 1 },
  rowValue: { fontSize: 13, fontWeight: '600', color: '#1a1a1a', flex: 1, textAlign: 'right' },

  adminActions: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#FFE0E0',
    shadowColor: '#E62B4A',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  adminTitle: { fontSize: 12, fontWeight: '800', color: '#C62828', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.6 },
  actionRow: { flexDirection: 'row' },

  editBtn: {
    backgroundColor: '#1a73e8',
    borderRadius: 10, paddingVertical: 14, alignItems: 'center',
    shadowColor: '#1a73e8', shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 }, shadowRadius: 6, elevation: 3,
  },
  editBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },

  deleteBtn: {
    backgroundColor: '#E62B4A',
    borderRadius: 10, paddingVertical: 14, alignItems: 'center',
    shadowColor: '#E62B4A', shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 }, shadowRadius: 6, elevation: 3,
  },
  deleteBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },

  confirmText: { fontSize: 12, fontWeight: '700', color: '#C62828', marginBottom: 6, textAlign: 'center' },
  cancelBtn:   { borderRadius: 10, paddingVertical: 14, alignItems: 'center', backgroundColor: '#f0f0f0' },
  cancelBtnText: { fontSize: 14, fontWeight: '700', color: '#555' },

  deleteError: {
    marginTop: 10, padding: 12, backgroundColor: '#FFF0F0',
    borderRadius: 8, borderLeftWidth: 4, borderLeftColor: '#E62B4A',
  },
  deleteErrorText: { fontSize: 12, color: '#C62828' },

  // ── Image Gallery ─────────────────────────────────────
  gallerySection: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 14,
    shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6, elevation: 2,
  },
  sectionLabel: { fontSize: 12, fontWeight: '800', color: '#555', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  galleryScroll: { flexDirection: 'row' },
  galleryImage:  { width: 160, height: 110, borderRadius: 10, marginRight: 10 },

  // ── Map button ────────────────────────────────────────
  mapBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#1a73e8', borderRadius: 12, paddingVertical: 14,
    marginBottom: 14,
    shadowColor: '#1a73e8', shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 }, shadowRadius: 6, elevation: 3,
  },
  mapBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
