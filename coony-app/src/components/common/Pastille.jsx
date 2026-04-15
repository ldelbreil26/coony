import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../../utils/colors';

const Pastille = ({ text, color = COLORS.background, textColor = COLORS.text, style }) => {
  return (
    <View style={[styles.pastille, { backgroundColor: color }, style]}>
      <Text style={[styles.pastilleTexte, { color: textColor }]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pastille: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  pastilleTexte: {
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.5,
  },
});

export default Pastille;
