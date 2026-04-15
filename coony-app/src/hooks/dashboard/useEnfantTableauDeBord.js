import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { getDernierQuestionnaire } from "../../data/repositories/questionnaire.repo";
import { getMiniJeuById } from "../../utils/mapper/miniJeuMapper";
import { getEmotionDetails } from "../../utils/mapper/emotionMapper";

export const useEnfantTableauDeBord = (enfantSelectionne) => {
  const [questionnaireDuJour, setQuestionnaireDuJour] = useState(null);
  const [chargement, setChargement] = useState(true);

  const verifierQuestionnaireDuJour = async () => {
    if (!enfantSelectionne?.id_enfant) return;
    try {
      setChargement(true);
      const trouve = await getDernierQuestionnaire(
        enfantSelectionne.id_enfant,
      );
      setQuestionnaireDuJour(trouve);
    } catch (error) {
      console.error("Erreur lors de la récupération :", error);
    } finally {
      setChargement(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      verifierQuestionnaireDuJour();
    }, [enfantSelectionne]),
  );

  const emotionDetails = getEmotionDetails(
    questionnaireDuJour?.emotion_nom,
  ) || {
    color: "#D9D9D9",
    iconName: "emoticon-happy-outline",
    label: "Inconnu",
  };

  const activiteRecommandee = questionnaireDuJour?.id_recommandation
    ? getMiniJeuById(questionnaireDuJour.id_recommandation)
    : null;

  return {
    questionnaireDuJour,
    emotionDetails,
    activiteRecommandee,
    chargement,
    rafraichir: verifierQuestionnaireDuJour
  };
};
