
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Platform, Modal, FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Cross-platform Dropdown using a Modal list
export default function Dropdown({ label, options, value, onChange, highlighted }) {
  const [visible, setVisible] = useState(false);

  const displayLabel = value || label;

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={[styles.trigger, highlighted && styles.highlighted]}
        onPress={() => setVisible(true)}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.triggerText,
            value ? styles.selectedText : styles.placeholderText,
            highlighted && styles.highlightedText,
          ]}
          numberOfLines={1}
        >
          {displayLabel}
        </Text>
        <MaterialIcons
          name="keyboard-arrow-down"
          size={20}
          color={highlighted ? '#fff' : '#333'}
        />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.dropdown}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <MaterialIcons name="close" size={20} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.option, value === item && styles.selectedOption]}
                  onPress={() => {
                    onChange(item);
                    setVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      value === item && styles.selectedOptionText,
                    ]}
                  >
                    {item}
                  </Text>
                  {value === item && (
                    <MaterialIcons name="check" size={16} color="#E62B4A" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 4,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  highlighted: {
    backgroundColor: '#1a73e8',
    borderColor: '#1a73e8',
  },
  triggerText: {
    fontSize: 14,
    flex: 1,
  },
  placeholderText: {
    color: '#999',
  },
  selectedText: {
    color: '#1a1a1a',
    fontWeight: '600',
  },
  highlightedText: {
    color: '#fff',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 20,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    maxHeight: 400,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  dropdownTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderColor: '#f5f5f5',
  },
  selectedOption: {
    backgroundColor: '#FFF0F3',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedOptionText: {
    color: '#E62B4A',
    fontWeight: '600',
  },
});
