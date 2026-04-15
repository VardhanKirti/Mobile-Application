
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SummaryCard({ title, rows, accentColor = '#E62B4A' }) {
  return (
    <View style={styles.card}>
      <Text style={[styles.title, { color: accentColor }]}>{title}</Text>
      {rows.map((row, i) => (
        <View key={i} style={styles.row}>
          <Text style={styles.label}>{row.label}</Text>
          <Text style={styles.value}>{row.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  row: {
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 1,
  },
});
