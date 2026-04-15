import React from 'react';
import { View, StyleSheet } from 'react-native';
import COLORS from '../../utils/colors';

const Card = ({ children, style, elevation = 4 }) => {
  return (
    <View style={[
      styles.card, 
      { elevation },
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 28,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
});

export default Card;
