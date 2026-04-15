import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useQuestionnaire } from "../../../src/state/questionnaireState";
import COLORS from "../../../src/utils/colors";
import FondOnde from "../../../src/components/FondOnde";
import EnteteQuestionnaire from "../../../src/components/EnteteQuestionnaire";

export default function QuestionLieu() {
  const { mettreAJourQuestionnaire } = useQuestionnaire();
  const [lieuSelectionne, setLieuSelectionne] = useState(null);

  const lieux = [
    { id: 1, label: "À l'école", icon: "school-outline" },
    { id: 2, label: "À la maison", icon: "home-outline" },
    { id: 3, label: "Dehors / Parc", icon: "tree-outline" },
    { id: 4, label: "Chez des amis", icon: "account-group-outline" },
    { id: 5, label: "Autre part", icon: "map-marker-question-outline" },
  ];

  const handleValidation = () => {
    if (!lieuSelectionne) return;
    
    mettreAJourQuestionnaire({
      idLieu: lieuSelectionne.id,
      lieuLabel: lieuSelectionne.label,
    });
    router.push("/questionnaire/resultat");
  };

  return (
    <View style={styles.mainWrapper}>
      <FondOnde />
      
      <EnteteQuestionnaire 
        etape="4 / 4" 
        onBack={() => router.back()} 
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionTexte}>
            <Text style={styles.intro}>Dernière petite chose...</Text>
            <Text style={styles.titre}>Où te trouves-tu ?</Text>
        </View>

        <View style={styles.liste}>
          {lieux.map((lieu) => {
            const estSelectionne = lieuSelectionne?.id === lieu.id;
            return (
              <TouchableOpacity
                key={lieu.id}
                style={[
                  styles.itemLieu,
                  estSelectionne && styles.itemSelectionne
                ]}
                onPress={() => setLieuSelectionne(lieu)}
              >
                <View style={[styles.iconBox, estSelectionne && { backgroundColor: COLORS.primary }]}>
                  <MaterialCommunityIcons 
                    name={lieu.icon} 
                    size={28} 
                    color={estSelectionne ? COLORS.white : COLORS.textLight} 
                  />
                </View>
                <Text style={[styles.labelLieu, estSelectionne && styles.labelSelectionne]}>
                  {lieu.label}
                </Text>
                {estSelectionne && (
                  <MaterialCommunityIcons name="check-circle" size={24} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity 
          style={[styles.boutonFin, !lieuSelectionne && styles.boutonDesactive]} 
          onPress={handleValidation}
          disabled={!lieuSelectionne}
        >
          <Text style={styles.texteFin}>VOIR LE RÉSULTAT</Text>
          <MaterialCommunityIcons name="sparkles" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1 },
  container: { paddingHorizontal: 25, paddingTop: 30, paddingBottom: 40 },
  sectionTexte: { marginBottom: 30 },
  intro: { fontSize: 18, fontWeight: "600", color: COLORS.primary, marginBottom: 5 },
  titre: { fontSize: 26, fontWeight: "900", color: COLORS.text, lineHeight: 32 },

  liste: { gap: 12 },
  itemLieu: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 20,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  itemSelectionne: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.background,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  labelLieu: { flex: 1, fontSize: 16, fontWeight: "700", color: COLORS.text },
  labelSelectionne: { color: COLORS.primary, fontWeight: "900" },

  boutonFin: {
    marginTop: 40,
    height: 70,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    elevation: 5
  },
  boutonDesactive: { opacity: 0.5 },
  texteFin: { fontSize: 18, fontWeight: "900", color: COLORS.white, letterSpacing: 1 }
});
