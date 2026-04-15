import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../../utils/colors';

const HistoryItem = ({ emotion, intensity, date, details, isLast }) => {
  return (
    <View style={[styles.container, isLast && styles.noBorder]}>
      <View style={[styles.dateBox, { backgroundColor: details.color + '20' }]}>
         <Text style={[styles.dateText, { color: details.color }]}>
            {date.split('-')[2].split(' ')[0]}
         </Text>
         <Text style={styles.monthText}>avr.</Text>
      </View>
      <View style={styles.content}>
         <Text style={styles.emotionText}>{emotion}</Text>
         <Text style={styles.subText}>Intensité : {intensity}/5</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.accent} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  dateBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '900',
  },
  monthText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textLight,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
  },
  emotionText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  subText: {
    fontSize: 12,
    color: COLORS.textLight,
  },
});

export default HistoryItem;
