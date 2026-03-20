import { useState } from "react";
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import HeaderQuestionnaire from "../components/EnteteQuestionnaire";
import { useQuestionnaire } from "../state/QuestionnaireState";

export default function Intensite() {
  const { mettreAJourQuestionnaire } = useQuestionnaire();

  const [intensiteSelectionnee, setIntensiteSelectionnee] = useState(null);

  const intensites = [
    { id: 5, label: "Très fort !!" },
    { id: 4, label: "Fort !" },
    { id: 3, label: "Moyen" },
    { id: 2, label: "Léger" },
    { id: 1, label: "Très léger" }
  ];

  const handleValidation = () => {
    if (!intensiteSelectionnee) return;

    mettreAJourQuestionnaire({
      intensiteEmotion: intensiteSelectionnee.id,
      intensiteLabel: intensiteSelectionnee.label,
    });

    router.push("/questionnaire/corps");
  };

  return (
  <>
    <HeaderQuestionnaire />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titre}>
          Est-ce que c’est léger...{"\n"}ou très fort ?
        </Text>

        <View style={styles.timeline}>
          {intensites.map((item, index) => {
            const selectionne = intensiteSelectionnee?.id === item.id;

            return (
              <TouchableOpacity
                key={item.id}
                style={styles.ligne}
                onPress={() => setIntensiteSelectionnee(item)}
              >
                <Text
                  style={[
                    styles.label,
                    selectionne && styles.labelSelectionne
                  ]}
                >
                  {item.label}
                </Text>

                <View style={styles.colonne}>
                  <View
                    style={[
                      styles.cercle,
                      selectionne && styles.cercleSelectionne
                    ]}
                  />

                  {index !== intensites.length - 1 && (
                    <View style={styles.ligneVerticale} />
                  )}
                </View>
              </TouchableOpacity>
          );
        })}
      </View>

        {intensiteSelectionnee && (
          <TouchableOpacity
            style={styles.boutonValidation}
            onPress={handleValidation}
          >
            <Text style={styles.texteValidation}>Oui</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

    </>

  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F4F4F4",
    paddingHorizontal: 40,
    paddingTop: 125,
    paddingBottom: 40
  },

  titre: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 50,
    color: "#333"
  },

  timeline: {
    alignItems: "center"
  },

  ligne: {
    flexDirection: "row",
    alignItems: "center",
    height: 105
  },

  label: {
    fontSize: 18,
    color: "#444",
    width: 140,
    textAlign: "left",
    marginRight: 20,
    lineHeight: 24,
    paddingBottom: 65
  },

  labelSelectionne: {
    fontWeight: "700"
  },

  colonne: {
    alignItems: "center",
    justifyContent: "flex-start",
    height: "100%"
  },

  cercle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 4,
    borderColor: "#CFCFCF",
    backgroundColor: "#F4F4F4"
  },

  cercleSelectionne: {
    backgroundColor: "#CFCFCF"
  },

  ligneVerticale: {
    width: 6,
    flex: 1,
    backgroundColor: "#CFCFCF"
  },

  boutonValidation: {
    marginTop: 5,
    backgroundColor: "#D9D9D9",
    borderRadius: 24,
    height: 120,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4
  },

  texteValidation: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333"
  }
});