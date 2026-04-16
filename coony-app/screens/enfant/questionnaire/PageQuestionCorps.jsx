import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useQuestionnaire } from "../../../src/state/questionnaireState";
import COLORS from "../../../src/utils/colors";
import FondOnde from "../../../src/components/FondOnde";
import EnteteQuestionnaire from "../../../src/components/EnteteQuestionnaire";

export default function QuestionCorps() {
  const { mettreAJourQuestionnaire } = useQuestionnaire();
  const [signalSelectionne, setSignalSelectionne] = useState(null);

  const signaux = [
    { id: 1, label: "Coeur rapide", icon: "heart-pulse" },
    { id: 2, label: "Tout va bien", icon: "emoticon-neutral-outline" },
    { id: 3, label: "Ventre serré", icon: "vibrate" },
    { id: 4, label: "Corps tendu", icon: "lightning-bolt" },
    { id: 5, label: "Fatigué", icon: "sleep" },
    { id: 6, label: "Je ne sais pas", icon: "help-circle-outline" }
  ];

  const handleValidation = () => {
    if (!signalSelectionne) return;
    
    mettreAJourQuestionnaire({
      idSignalCorporel: signalSelectionne.id,
      signalLabel: signalSelectionne.label,
    });
    router.push("/questionnaire/lieu");
  };

  return (
    <View style={styles.mainWrapper}>
      <FondOnde />
      <EnteteQuestionnaire etape={3} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionTexte}>
            <Text style={styles.intro}>Écoute ton corps...</Text>
            <Text style={styles.titre}>Où est-ce que ça se passe ?</Text>
        </View>

        <View style={styles.grille}>
          {signaux.map((item) => {
            const estSelectionne = signalSelectionne?.id === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                style={[
                  styles.carte,
                  estSelectionne && styles.carteSelectionnee
                ]}
                onPress={() => setSignalSelectionne(item)}
              >
                <MaterialCommunityIcons 
                  name={item.icon} 
                  size={40} 
                  color={estSelectionne ? COLORS.primary : COLORS.textLight} 
                />
                <Text style={[styles.label, estSelectionne && styles.labelSelectionne]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {signalSelectionne && (
          <TouchableOpacity style={styles.boutonSuivant} onPress={handleValidation}>
            <Text style={styles.texteSuivant}>C'est exactement ça</Text>
            <MaterialCommunityIcons name="chevron-right" size={28} color={COLORS.white} />
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1 },
  container: { 
    flex: 1, 
    paddingHorizontal: 25, 
    paddingTop: 20, 
    paddingBottom: 40 
  },
  sectionTexte: { marginBottom: 30 },
  intro: { fontSize: 18, fontWeight: "600", color: COLORS.primary, marginBottom: 5 },
  titre: { fontSize: 26, fontWeight: "900", color: COLORS.text, lineHeight: 32 },

  grille: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 15 },
  carte: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: COLORS.white,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }
  },
  carteSelectionnee: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white, // On garde le fond blanc ou COLORS.card pour la clarté
    elevation: 8,
    shadowOpacity: 0.2,
  },
  label: { 
    marginTop: 12, 
    fontSize: 14, 
    color: COLORS.textLight, 
    textAlign: 'center', 
    fontWeight: "600" 
  },
  labelSelectionne: { 
    color: COLORS.primary, 
    fontWeight: "900" 
  },

  boutonSuivant: {
    marginTop: -10,
    height: 70,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    elevation: 5
  },
  texteSuivant: { fontSize: 18, fontWeight: "900", color: COLORS.white }
});