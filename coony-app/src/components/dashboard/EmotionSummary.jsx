import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../../utils/colors';

const EmotionSummary = ({ emotion, intensity, details, bodyResponse }) => {
  if (!emotion) return null;

  return (
    <View style={styles.container}>
      <View style={styles.emotionHeader}>
        <MaterialCommunityIcons
          name={details.iconName}
          size={80}
          color={details.color}
        />
        <Text style={[styles.emotionTitre, { color: details.color }]}>
          {emotion}
        </Text>
      </View>

      <View style={styles.grilleInfos}>
        <View style={styles.infoBulle}>
          <Text style={styles.infoLabel}>INTENSITÉ</Text>
          <Text style={[styles.infoValeur, { color: details.color }]}>
            {intensity}/5
          </Text>
        </View>
        <View style={styles.separateurV} />
        <View style={styles.infoBulle}>
          <Text style={styles.infoLabel}>DANS MON CORPS</Text>
          <Text style={styles.infoValeur}>
            {bodyResponse || "Tranquille"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  emotionHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  emotionTitre: {
    fontSize: 28,
    fontWeight: '900',
    marginTop: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  grilleInfos: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    width: '100%',
  },
  infoBulle: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  infoValeur: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 4,
  },
  separateurV: {
    width: 1,
    height: 30,
    backgroundColor: '#E0E0E0',
  },
});

export default EmotionSummary;
