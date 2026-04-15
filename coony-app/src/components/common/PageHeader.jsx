import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../../utils/colors';

const PageHeader = ({ title, subtitle, showHome = true, showAccount = false, rightElement }) => {
  return (
    <View style={styles.header}>
      <View>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        {title && <Text style={styles.title}>{title}</Text>}
      </View>
      
      <View style={styles.headerActions}>
        {showHome && (
          <TouchableOpacity style={styles.boutonRond} onPress={() => router.push("/menu")}>
            <MaterialCommunityIcons name="home-variant" size={26} color={COLORS.primary} />
          </TouchableOpacity>
        )}

        {showAccount && (
          <TouchableOpacity style={styles.boutonRond} onPress={() => router.push("/compte_parent")}>
            <MaterialCommunityIcons name="account" size={28} color={COLORS.primary} />
          </TouchableOpacity>
        )}

        {rightElement}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.primary,
    marginTop: -5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  boutonRond: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }
  },
});

export default PageHeader;
