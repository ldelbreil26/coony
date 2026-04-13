import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

import HeaderQuestionnaire from "../components/EnteteQuestionnaire";
import { router, useLocalSearchParams } from "expo-router";
import { useQuestionnaire } from "../state/QuestionnaireState";

export default function Lieu() {
  const { mettreAJourQuestionnaire } = useQuestionnaire();

  const [lieuSelectionne, setLieuSelectionne] = useState(null);

  const lieux = [
    { id: 1, label: "À la maison" },
    { id: 2, label: "À l’école" },
    { id: 3, label: "Dehors" },
    { id: 4, label: "Dans la voiture" },
    { id: 5, label: "Avec quelqu’un" },
    { id: 6, label: "Je ne sais pas" }
  ];

  const handleValidation = () => {
    if (!lieuSelectionne) return;

    mettreAJourQuestionnaire({
      idLieu: Number(lieuSelectionne.id),
      lieuLabel: lieuSelectionne.label,
    });

    router.push("/questionnaire/resultat");
  };

  return (
    <>
      <HeaderQuestionnaire />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.intro}>Merci :){"\n"}Dernière question,</Text>

        <Text style={styles.titre}>Tu étais où à ce moment-là ?</Text>

        <Text style={styles.sousTitre}>Tu peux choisir la réponse qui te correspond le plus.</Text>

        <View style={styles.grille}>
          {lieux.map((lieu) => {
            const selectionne = lieuSelectionne?.id === lieu.id;

            return (
              <TouchableOpacity
                key={lieu.id}
                style={[styles.bouton, selectionne && styles.boutonSelectionne]}
                onPress={() => setLieuSelectionne(lieu)}
              >
                <Text style={styles.texteBouton}>{lieu.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {lieuSelectionne && (
          <>
            <Text style={styles.confirmation}>
              Tu étais {lieuSelectionne.label.toLowerCase()} ?
            </Text>

            <TouchableOpacity
              style={styles.boutonValidation}
              onPress={handleValidation}
            >
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
    textAlign: "center",
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
  bouton: {
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
  boutonSelectionne: {
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
    textAlign: "center",
    marginBottom: 40,
    color: "#333",
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