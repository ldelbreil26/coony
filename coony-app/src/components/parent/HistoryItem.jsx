import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../../utils/colors';
import { getEmotionDetails } from '../../utils/mapper/emotionMapper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const HistoryItem = ({ intensity, date, emotion_nom, isLast }) => {
  const histMood = getEmotionDetails(emotion_nom) || { color: COLORS.primary };

  // Safe extraction of the day
  const safeDateDay = date?.split?.("-")?.[2]?.split?.(" ")?.[0] ?? "--";

  return (
    <View style={[styles.ligneHistorique, isLast && { borderBottomWidth: 0 }]}>
      <View style={[styles.historiqueDateBox, { backgroundColor: histMood.color + '20' }]}>
        <Text style={[styles.histDate, { color: histMood.color }]}>
          {safeDateDay}
        </Text>
        {/* Note: You might want to make the month dynamic later! */}
        <Text style={styles.histMois}>avr.</Text>
      </View>
      
      <View style={{ flex: 1 }}>
        <Text style={styles.histEmotion}>{emotion_nom}</Text>
        <Text style={styles.histSub}>Intensité : {intensity}/5</Text>
      </View>
      
      <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.accent} />
    </View>
  );
};

const styles = StyleSheet.create({
  ligneHistorique: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.background },
  historiqueDateBox: { width: 45, height: 45, borderRadius: 12, justifyContent: "center", alignItems: "center", marginRight: 15 },
  histDate: { fontSize: 16, fontWeight: "900" },
  histMois: { fontSize: 10, fontWeight: "700", color: COLORS.textLight, textTransform: "uppercase" },
  histEmotion: { fontSize: 15, fontWeight: "700", color: COLORS.text },
  histSub: { fontSize: 12, color: COLORS.textLight },
});

export default HistoryItem;
