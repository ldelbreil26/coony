import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../../utils/colors';

const ActivityCard = ({ title, label, icon, color, onPress, disabled, badgeIcon = "play" }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        disabled && styles.disabled
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={[
        styles.iconCercle, 
        { backgroundColor: color || COLORS.text }
      ]}>
        <MaterialCommunityIcons 
          name={icon || "lock"} 
          size={24} 
          color={COLORS.white} 
        />
      </View>
      
      <View style={styles.contenuTexte}>
        {label && <Text style={styles.label}>{label}</Text>}
        <Text style={[
          styles.valeur,
          { color: disabled ? COLORS.textLight : COLORS.text }
        ]}>
          {title}
        </Text>
      </View>

      {!disabled && (
        <View style={[styles.badge, { backgroundColor: color }]}>
          <MaterialCommunityIcons name={badgeIcon} size={16} color={COLORS.white} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  disabled: {
    opacity: 0.7,
    backgroundColor: '#F5F5F5',
    elevation: 0,
  },
  iconCercle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contenuTexte: {
    flex: 1,
    marginLeft: 15,
  },
  label: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.textLight,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  valeur: {
    fontSize: 18,
    fontWeight: "900",
    marginTop: 2,
  },
  badge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ActivityCard;
