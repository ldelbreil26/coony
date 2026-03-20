import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, Switch } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import HeaderQuestionnaire from "../components/EnteteQuestionnaire";
import { useQuestionnaire } from "../state/QuestionnaireState";

export default function Emotion() {
  const { mettreAJourQuestionnaire } = useQuestionnaire();

  const [emotionSelectionnee, setEmotionSelectionnee] = useState(null);

  const emotions = [
    { id: 1, label: "Joyeux" },
    { id: 2, label: "Triste" },
    { id: 3, label: "Calme" },
    { id: 4, label: "En colère" },
    { id: 5, label: "Aucun" },
    { id: 6, label: "Angoissé" },
  ];

  const handleValidation = () => {
    if (!emotionSelectionnee) return;

    mettreAJourQuestionnaire({
      idEmotion: emotionSelectionnee.id,
      emotionLabel: emotionSelectionnee.label,
    });

    router.push("/questionnaire/intensite");
  };

  return (
  <>
    <HeaderQuestionnaire />
    
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.intro}>
          D’accord :){"\n"}
          On commence doucement..
        </Text>

        <Text style={styles.titre}>Comment tu te sens aujourd’hui ?</Text>

        <Text style={styles.sousTitre}>
          Tu peux choisir l’émotion qui te ressemble le plus.
        </Text>

        <View style={styles.grille}>
          {emotions.map((emotion) => {
            const estSelectionnee = emotionSelectionnee?.id === emotion.id;

            return (
              <TouchableOpacity
                key={emotion.id}
                style={[
                  styles.boutonEmotion,
                  estSelectionnee && styles.boutonEmotionSelectionne,
                ]}
                onPress={() => setEmotionSelectionnee(emotion)}
              >
                <Text style={styles.texteBouton}>{emotion.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {emotionSelectionnee && (
          <>
            <Text style={styles.confirmation}>
              Tu te sens : {emotionSelectionnee.label} ?
            </Text>

            <TouchableOpacity style={styles.boutonValidation} onPress={handleValidation}>
              <Text style={styles.texteValidation}>Oui</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F4F4F4",
    paddingHorizontal: 36,
    paddingTop: 125,
    paddingBottom: 40,
  },
  intro: {
    fontSize: 16,
    color: "#333",
    lineHeight: 30,
    marginBottom: 20,
  },
  titre: {
    fontSize: 25,
    fontWeight: "700",
    color: "#333",
    marginBottom: 30,
  },
  sousTitre: {
    fontSize: 14,
    color: "#4A4A4A",
    marginBottom: 40,
    textAlign: "center",
  },
  grille: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 36,
    marginBottom: 50,
  },
  boutonEmotion: {
    width: "46%",
    minHeight: 64,
    backgroundColor: "#F8F8F8",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  boutonEmotionSelectionne: {
    backgroundColor: "#D9D9D9",
  },
  texteBouton: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  confirmation: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginBottom: 48,
  },
  boutonValidation: {
    alignSelf: "center",
    width: "92%",
    minHeight: 120,
    backgroundColor: "#D9D9D9",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  texteValidation: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333",
  },
});