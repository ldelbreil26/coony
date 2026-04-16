import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../../utils/colors';

const ChildSelector = ({ enfants, selectedChildId, onSelectChild, onAddChild }) => {
  return (
    <View style={styles.selecteurContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={{ paddingRight: 20 }}
      >
        {enfants.map((child) => (
          <TouchableOpacity 
            key={child.id_enfant} 
            style={[
              styles.ongletEnfant, 
              selectedChildId === child.id_enfant && styles.ongletActif
            ]}
            onPress={() => onSelectChild(child)}
          >
            <Text style={[
              styles.ongletTexte, 
              selectedChildId === child.id_enfant && styles.ongletTexteActif
            ]}>
              {child.prenom}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.ongletAjout} onPress={onAddChild}>
          <MaterialCommunityIcons name="plus" size={20} color={COLORS.text} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  selecteurContainer: { marginBottom: 25 },
  ongletEnfant: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: COLORS.card, marginRight: 10, borderWidth: 1, borderColor: COLORS.accent },
  ongletActif: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  ongletTexte: { fontSize: 14, fontWeight: "700", color: COLORS.text },
  ongletTexteActif: { color: COLORS.white },
  ongletAjout: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.accent, justifyContent: "center", alignItems: "center" },
});

export default ChildSelector;
