import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import HeaderQuestionnaire from "../components/EnteteQuestionnaire";
import { useQuestionnaire } from "../state/QuestionnaireState";

export default function Corps() {
  const { mettreAJourQuestionnaire } = useQuestionnaire();

  const [signalSelectionne, setSignalSelectionne] = useState(null);

  const signaux = [
    { id: 1, label: "Coeur rapide" },
    { id: 2, label: "Normal" },
    { id: 3, label: "Ventre serré" },
    { id: 4, label: "Corps tendu" },
    { id: 5, label: "Fatigué" },
    { id: 6, label: "Je ne sais pas" }
  ];

  const handleValidation = () => {
    if (!signalSelectionne) return;

    mettreAJourQuestionnaire({
      idSignalCorporel: Number(signalSelectionne.id),
      signalLabel: signalSelectionne.label,
    });

    router.push("/questionnaire/lieu");

  };

  return (

  <>
      <HeaderQuestionnaire />
      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.intro}>
          D’accord :){"\n"}
          Maintenant, dis moi,
        </Text>

        <Text style={styles.titre}>
          Est-ce que tu ressens quelque{"\n"}chose dans ton corps ?
        </Text>

        <Text style={styles.sousTitre}>
          Tu peux choisir la réponse qui te correspond le plus.
        </Text>

        <View style={styles.grille}>

          {signaux.map((signal) => {

            const selectionne = signalSelectionne?.id === signal.id;

            return (

              <TouchableOpacity
                key={signal.id}
                style={[
                  styles.bouton,
                  selectionne && styles.boutonSelectionne
                ]}
                onPress={() => setSignalSelectionne(signal)}
              >

                <Text style={styles.texteBouton}>
                  {signal.label}
                </Text>

              </TouchableOpacity>

            );

          })}

        </View>

        {signalSelectionne && (

          <>
            <Text style={styles.confirmation}>
              Tu sens que ton {signalSelectionne.label.toLowerCase()} ?
            </Text>

            <TouchableOpacity
              style={styles.boutonValidation}
              onPress={handleValidation}
            >

              <Text style={styles.texteValidation}>
                Oui
              </Text>

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
    paddingBottom: 40
  },

  intro: {
    fontSize: 16,
    color: "#333",
    lineHeight: 30,
    marginBottom: 20
  },

  titre: {
    fontSize: 25,
    fontWeight: "700",
    color: "#333",
    marginBottom: 34,
    textAlign: "center"
  },

  sousTitre: {
    fontSize: 14,
    color: "#4A4A4A",
    marginBottom: 50,
    textAlign: "center"
  },

  grille: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 36,
    marginBottom: 50
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
    elevation: 3
  },

  boutonSelectionne: {
    backgroundColor: "#D9D9D9"
  },

  texteBouton: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center"
  },

  confirmation: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 40,
    color: "#333"
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
    elevation: 3
  },

  texteValidation: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333"
  }

});