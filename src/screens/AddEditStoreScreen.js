
import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DashboardHeader from '../components/DashboardHeader';
import { createProperty, updateProperty } from '../data/propertyService';

// ── Field definitions ─────────────────────────────────────────────────────────
const FIELDS = [
  { key: 'name',                    label: 'Store Name',           required: true,  keyboard: 'default' },
  { key: 'city',                    label: 'City',                 required: true,  keyboard: 'default' },
  { key: 'store_type',              label: 'Store Type (FS / EBO)', required: true,  keyboard: 'default', hint: 'FS or EBO' },
  { key: 'product_type',            label: 'Product Type',         required: false, keyboard: 'default', hint: 'Elite / Neo / Lux (FS only)' },
  { key: 'business_type',           label: 'Business Type',        required: false, keyboard: 'default', hint: '1P or 2P (FS only)' },
  { key: 'floor',                   label: 'Floor',                required: false, keyboard: 'default' },
  { key: 'launch_year',             label: 'Launch Year',          required: false, keyboard: 'numeric' },
  { key: 'cost_per_sqft',           label: 'Cost / Sq Ft (₹)',     required: false, keyboard: 'numeric' },
  { key: 'monthly_rent',            label: 'Monthly Rent (₹)',     required: false, keyboard: 'numeric' },
  { key: 'total_sqft',              label: 'Total Sq Ft',          required: false, keyboard: 'numeric' },
  { key: 'escalation_percent',      label: 'Escalation %',         required: false, keyboard: 'numeric' },
  { key: 'escalation_cycle',        label: 'Escalation Cycle (yrs)',required: false, keyboard: 'numeric' },
  { key: 'security_deposit_months', label: 'Security Deposit (months)', required: false, keyboard: 'numeric' },
  { key: 'lockin_status',           label: 'Lock-in Status',       required: false, keyboard: 'default' },
  { key: 'contract_end',            label: 'Contract End (YYYY-MM-DD)', required: false, keyboard: 'default' },
  { key: 'next_escalation_date',    label: 'Next Escalation (YYYY-MM-DD)', required: false, keyboard: 'default' },
];

// Numeric fields that should be stored as Number not String
const NUMERIC_FIELDS = [
  'launch_year','cost_per_sqft','monthly_rent','total_sqft',
  'escalation_percent','escalation_cycle','security_deposit_months',
];

// Build empty form
const emptyForm = () => Object.fromEntries(FIELDS.map(f => [f.key, '']));

// Seed form from an existing store
const seedForm = (store) =>
  Object.fromEntries(FIELDS.map(f => [f.key, store[f.key] != null ? String(store[f.key]) : '']));

export default function AddEditStoreScreen({ route, navigation }) {
  const { store = null } = route.params ?? {};   // null → Add mode, object → Edit mode
  const isEdit = store !== null;

  const [form,      setForm]      = useState(isEdit ? seedForm(store) : emptyForm());
  const [saving,    setSaving]    = useState(false);
  const [errors,    setErrors]    = useState({});
  const [saveError, setSaveError] = useState(null);

  const set = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }));
  };

  // ── Validate ──────────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    FIELDS.filter(f => f.required).forEach(f => {
      if (!form[f.key]?.trim()) errs[f.key] = `${f.label} is required.`;
    });
    if (form.store_type && !['FS','EBO'].includes(form.store_type.trim().toUpperCase())) {
      errs.store_type = 'Must be FS or EBO';
    }
    return errs;
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaveError(null);
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    // Build Firestore document, converting numerics
    const data = {};
    FIELDS.forEach(({ key }) => {
      const raw = form[key]?.trim();
      if (!raw) { data[key] = null; return; }
      data[key] = NUMERIC_FIELDS.includes(key) ? Number(raw) : raw;
    });

    try {
      setSaving(true);
      if (isEdit) {
        await updateProperty(store.id, data);
      } else {
        await createProperty(data);
      }
      navigation.goBack();
    } catch (e) {
      console.error('[Save failed]', e?.code, e?.message, e);
      setSaveError(
        `Save failed: ${e?.message ?? e?.code ?? 'Unknown error'}.\n` +
        `If this says "PERMISSION_DENIED", check:\n` +
        `• Your Firestore rules allow admin to write\n` +
        `• Your role in Firestore users/${'{uid}'} is "admin"\n` +
        `• You are logged in as admin`
      );
    } finally {
      setSaving(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <DashboardHeader title={isEdit ? 'Edit Store' : 'Add Store'} showBack />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            {FIELDS.map(({ key, label, required, keyboard, hint }) => (
              <View key={key} style={styles.field}>
                <Text style={styles.label}>
                  {label}
                  {required && <Text style={{ color: '#E62B4A' }}> *</Text>}
                </Text>
                {hint && <Text style={styles.hint}>{hint}</Text>}
                <TextInput
                  style={[styles.input, errors[key] && styles.inputError]}
                  value={form[key]}
                  onChangeText={v => set(key, v)}
                  keyboardType={keyboard}
                  autoCapitalize="none"
                  placeholder={`Enter ${label.toLowerCase()}`}
                  placeholderTextColor="#ccc"
                  returnKeyType="next"
                />
                {errors[key] && <Text style={styles.fieldError}>{errors[key]}</Text>}
              </View>
            ))}
          </View>

          {/* ── Error banner ── */}
          {saveError && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{saveError}</Text>
            </View>
          )}

          {/* Save button */}
          <TouchableOpacity
            style={[styles.saveBtn, saving && { opacity: 0.7 }]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.85}
          >
            {saving
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.saveBtnText}>{isEdit ? '💾  Save Changes' : '➕  Add Store'}</Text>
            }
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: '#000000' },
  scroll:  { flex: 1 },
  content: { padding: 16, paddingBottom: 48 },

  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  field:   { marginBottom: 14 },
  label:   { fontSize: 12, fontWeight: '700', color: '#FFD700', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.4 },
  hint:    { fontSize: 11, color: '#888888', marginBottom: 4 },
  input: {
    borderWidth: 1.5,
    borderColor: '#444444',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#FFFFFF',
    backgroundColor: '#222222',
  },
  inputError:  { borderColor: '#E62B4A', backgroundColor: 'rgba(230, 43, 74, 0.1)' },
  fieldError:  { fontSize: 11, color: '#E62B4A', marginTop: 4 },

  saveBtn: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: { color: '#000000', fontSize: 16, fontWeight: '700' },

  errorBanner: {
    backgroundColor: 'rgba(230, 43, 74, 0.1)',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#E62B4A',
    padding: 14,
    marginBottom: 12,
  },
  errorBannerText: { fontSize: 13, color: '#E62B4A', lineHeight: 20 },
});
