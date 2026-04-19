import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../../utils/colors';

/**
 * Un composant de défilement horizontal pour sélectionner un enfant à partir du compte parent.
 * 
 * Fournit un moyen intuitif pour les parents de basculer entre différents profils d'enfants.
 * Comprend un bouton dédié pour ajouter un nouveau profil d'enfant.
 * 
 * @param {Object} props
 * @param {Array<Object>} props.enfants - Liste des enfants associés au parent.
 * @param {number} props.selectedChildId - L'ID de l'enfant actuellement sélectionné.
 * @param {Function} props.onSelectChild - Fonction invoquée lorsqu'un enfant est touché.
 * @param {Function} props.onAddChild - Fonction invoquée lorsque le bouton 'plus' est touché.
 */
const ChildSelector = ({ enfants, selectedChildId, onSelectChild, onAddChild }) => {
  return (
    <View style={styles.selecteurContainer}>
      {/* Liste à défilement horizontal pour gérer les cas avec de nombreux enfants. */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={{ paddingRight: 20 }}
      >
        {/* Itère à travers les enfants pour les afficher comme des onglets sélectionnables. */}
        {enfants.map((child) => (
          <TouchableOpacity 
            key={child.id_enfant} 
            style={[
              styles.ongletEnfant, 
              // Met en évidence l'onglet s'il correspond à l'enfant actuellement sélectionné.
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
        
        {/* Bouton d'action pour naviguer vers l'écran 'Ajouter un enfant'. */}
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
