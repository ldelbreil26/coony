import { useMemo } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useQuestionnaire } from "../state/QuestionnaireState";
import { enregistrerQuestionnaire } from "../db/requetesMetier";
import { matchRecommandation } from "../services/serviceRecommandation";

export default function ResultatQuestionnaire() {
  const { questionnaire, reinitialiserQuestionnaire } = useQuestionnaire();

  const {
    idEnfant,
    prenom,
    
    idEmotion,
    emotionLabel,
    intensiteEmotion,
    
    idSignalCorporel,
    signalLabel,

    idLieu,
    lieuLabel,
  } = questionnaire;

  const resultat = useMemo(() => {
    return matchRecommandation(idEmotion, intensiteEmotion, idSignalCorporel);
  }, [idEmotion, intensiteEmotion, idSignalCorporel]);

  const lancerMiniJeu = async () => {
    try {
      await enregistrerQuestionnaire({
        idEnfant,
        prenom,
        idEmotion,
        emotionLabel,
        intensiteEmotion,
        idSignalCorporel,
        signalLabel,
        idLieu,
        lieuLabel,
      });

      // --- MODIFICATION ICI ---
      // On récupère l'idMiniJeu calculé par ton moteur de recommandation
      const idJeu = resultat.idMiniJeu; 
      
      reinitialiserQuestionnaire();

      // On redirige vers la route dynamique avec l'ID du jeu
      // router.replace est préférable à push pour éviter de revenir au questionnaire
      router.replace(`/mini-jeu/${idJeu}`);
      // -------------------------

    } catch (error) {
      console.error("Erreur enregistrement questionnaire :", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titre}>{resultat.titre}</Text>

      <Text style={styles.message}>{resultat.message}</Text>

      <Text style={styles.proposition}>{resultat.proposition}</Text>

      <Text style={styles.miniJeu}>{resultat.miniJeu}</Text>

      <TouchableOpacity style={styles.bouton} onPress={lancerMiniJeu}>
        <Text style={styles.texteBouton}>Lancer le mini-jeu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ... Tes styles restent identiques
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F4F4F4",
    paddingHorizontal: 36,
    paddingTop: 120,
    paddingBottom: 40,
  },
  titre: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 90,
  },
  message: {
    fontSize: 16,
    lineHeight: 38,
    color: "#333",
    textAlign: "center",
    marginBottom: 90,
  },
  proposition: {
    fontSize: 16,
    lineHeight: 34,
    color: "#333",
    textAlign: "center",
    marginBottom: 30,
  },
  miniJeu: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 120,
  },
  bouton: {
    alignSelf: "center",
    width: "92%",
    minHeight: 120,
    backgroundColor: "#D9D9D9",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  texteBouton: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },
});