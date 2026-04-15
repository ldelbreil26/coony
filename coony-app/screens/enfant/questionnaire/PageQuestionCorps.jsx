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
    { id: 1, label: "Tranquille", icon: "potted-plant", color: "#A5D6A7" },
    { id: 2, label: "Cœur qui bat vite", icon: "heart-pulse", color: "#EF9A9A" },
    { id: 3, label: "Mal au ventre", icon: "emoticon-confused-outline", color: "#FFCC80" },
    { id: 4, label: "Boule dans la gorge", icon: "Waves", color: "#CE93D8" },
    { id: 5, label: "Muscles serrés", icon: "arm-flex", color: "#90CAF9" },
    { id: 6, label: "Envie de bouger", icon: "run", color: "#FBC02D" },
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
      
      <EnteteQuestionnaire 
        etape="3 / 4" 
        onBack={() => router.back()} 
      />

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
                style={[
                  styles.carte,
                  estSelectionne && { borderColor: item.color, backgroundColor: item.color + '10', elevation: 6 }
                ]}
                onPress={() => setSignalSelectionne(item)}
              >
                <MaterialCommunityIcons 
                  name={item.icon} 
                  size={40} 
                  color={estSelectionne ? item.color : COLORS.textLight} 
                />
                <Text style={[styles.label, estSelectionne && { color: item.color, fontWeight: "900" }]}>
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
  container: { paddingHorizontal: 25, paddingTop: 30, paddingBottom: 40 },
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
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  label: { marginTop: 12, fontSize: 14, color: COLORS.text, textAlign: 'center', fontWeight: "700" },

  boutonSuivant: {
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
  texteSuivant: { fontSize: 18, fontWeight: "900", color: COLORS.white }
});
