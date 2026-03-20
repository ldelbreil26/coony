import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQuestionnaire } from "../state/QuestionnaireState";

export default function IntroQuestionnaire() {
  const { idEnfant, prenom } = useLocalSearchParams();
  const { mettreAJourQuestionnaire } = useQuestionnaire();

  const commencerQuestionnaire = () => {
    mettreAJourQuestionnaire({
      idEnfant: Number(idEnfant),
      prenom: prenom,
    });

    router.push("/questionnaire/emotion");
  };

  return (
    <View style={styles.container}>

      <Text style={styles.titre}>
        Petit questionnaire
      </Text>

      <Text style={styles.texte}>
        Nous allons te poser quelques petites questions
        pour comprendre comment tu te sens aujourd’hui.
      </Text>

      <Text style={styles.texte}>
        Il n’y a pas de bonne ou de mauvaise réponse.
        Tu peux simplement choisir ce qui te ressemble le plus.
      </Text>

      <Text style={styles.texte}>
        À la fin, nous te proposerons un petit jeu pour t’aider.
      </Text>

      <TouchableOpacity
        style={styles.bouton}
        onPress={commencerQuestionnaire}
      >
        <Text style={styles.texteBouton}>
          Commencer
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    justifyContent: "center",
    paddingHorizontal: 40
  },

  titre: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 80
  },

  texte: {
    fontSize: 17,
    color: "#333",
    textAlign: "center",
    lineHeight: 30,
    marginBottom: 25
  },

  bouton: {
    marginTop: 80,
    backgroundColor: "#D9D9D9",
    borderRadius: 24,
    paddingVertical: 35,
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3
  },

  texteBouton: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333"
  }

});