import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import COLORS from '../../utils/colors';

const Input = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry, 
  keyboardType,
  autoCapitalize = 'none',
  containerStyle,
  error
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textLight}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '700',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    height: 50,
    paddingHorizontal: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default Input;
