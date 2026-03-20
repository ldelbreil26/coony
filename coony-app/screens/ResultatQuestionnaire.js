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

  console.log(questionnaire);

  const resultat = useMemo(() => {
    // Colère forte
    if (idEmotion === 4 && intensiteEmotion >= 4) {
      return {
        titre: "Tu te sens très en colère.",
        message:
          "La colère peut être très forte dans le corps.\n" +
          "Ton cœur peut battre vite.\n" +
          "Tes muscles peuvent être tendus.\n\n" +
          "Quand la colère est grande,\n" +
          "ça peut être difficile de rester calme.\n\n" +
          "Tu n’as rien fait de mal.\n" +
          "Ton corps essaie juste de réagir.\n\n" +
          "On peut l’aider à se sentir plus tranquille.",
        proposition:
          "Je te propose un petit jeu pour t’aider à gérer cette émotion :",
        miniJeu: "RESPIRATION 4 - 4",
        idMiniJeu: 1,
        routeMiniJeu: "/dashboard-enfant",
      };
    }

    // Angoisse forte
    if (idEmotion === 6 && intensiteEmotion >= 4) {
      return {
        titre: "Tu te sens très angoissé(e).",
        message:
          "L’angoisse peut faire battre le cœur plus vite.\n" +
          "Le ventre peut se serrer.\n\n" +
          "C’est parfois impressionnant,\n" +
          "mais ton corps essaie de te protéger.\n\n" +
          "On peut l’aider à se calmer doucement.",
        proposition:
          "Je te propose un petit jeu pour t’aider à gérer cette émotion :",
        miniJeu: "RESPIRATION LENTE",
        idMiniJeu: 6,
        routeMiniJeu: "/dashboard-enfant",
      };
    }

    // Tristesse
    if (idEmotion === 2) {
      return {
        titre: "Tu te sens triste.",
        message:
          "La tristesse peut donner envie de se reposer,\n" +
          "de pleurer ou de rester calme.\n\n" +
          "C’est une émotion importante.\n" +
          "Elle montre que quelque chose compte pour toi.\n\n" +
          "On peut prendre un moment doux pour toi.",
        proposition:
          "Je te propose un petit jeu pour t’aider à gérer cette émotion :",
        miniJeu: "PAUSE CALME",
        idMiniJeu: 2,
        routeMiniJeu: "/dashboard-enfant",
      };
    }

    // Joie
    if (idEmotion === 1) {
      return {
        titre: "Tu te sens joyeux(se).",
        message:
          "La joie fait du bien au corps.\n" +
          "Tu peux avoir envie de bouger,\n" +
          "de sourire ou de partager.\n\n" +
          "C’est une belle émotion.\n" +
          "Tu peux en profiter pleinement.",
        proposition:
          "Je te propose un petit jeu pour continuer avec cette émotion :",
        miniJeu: "PARTAGE POSITIF",
        idMiniJeu: 7,
        routeMiniJeu: "/dashboard-enfant",
      };
    }

    // Calme
    if (idEmotion === 3) {
      return {
        titre: "Tu te sens calme.",
        message:
          "Ton corps semble tranquille.\n" +
          "C’est un bon moment pour respirer,\n" +
          "observer ou profiter du calme.\n\n" +
          "Tu peux garder ce moment doux encore un peu.",
        proposition:
          "Je te propose un petit jeu pour continuer avec cette émotion :",
        miniJeu: "MOMENT DÉTENTE",
        idMiniJeu: 8,
        routeMiniJeu: "/dashboard-enfant",
      };
    }

    return {
      titre: "Merci pour tes réponses.",
      message:
        "Tu as pris le temps d’écouter ton corps\n" +
        "et de dire comment tu te sens.\n\n" +
        "C’est déjà très important.\n" +
        "On peut maintenant faire une activité douce.",
      proposition:
        "Je te propose un petit jeu pour t’aider à continuer :",
      miniJeu: "ACTIVITÉ DOUCE",
      idMiniJeu: 4,
      routeMiniJeu: "/dashboard-enfant",
    };
  }, [idEmotion, intensiteEmotion, idSignalCorporel, idLieu]);

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

      reinitialiserQuestionnaire();
      router.push(resultat.routeMiniJeu);
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

    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },

  texteBouton: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },
});