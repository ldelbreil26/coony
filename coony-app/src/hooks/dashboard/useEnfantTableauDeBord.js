import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { getDernierQuestionnaire } from "../../data/repositories/questionnaire.repo";
import { fetchMiniJeu } from "../../utils/mapper/miniJeuMapper";
import { mapEmotion } from "../../utils/mapper/emotionMapper";
import { getRecommandation } from "../../data/repositories/recommendation.repo";

export const useEnfantTableauDeBord = (enfantSelectionne) => {
  const [questionnaireDuJour, setQuestionnaireDuJour] = useState(null);
  const [activiteRecommandee, setActiviteRecommandee] = useState(null);
  const [chargement, setChargement] = useState(true);

  const verifierQuestionnaireDuJour = async () => {
    if (!enfantSelectionne?.id_enfant) return;

    try {
      setChargement(true);

      const trouve = await getDernierQuestionnaire(enfantSelectionne.id_enfant);
      setQuestionnaireDuJour(trouve);

      if (trouve?.id_questionnaire) {
        const idMiniJeu = await getRecommandation(trouve.id_questionnaire);
        const jeu = idMiniJeu ? await fetchMiniJeu(idMiniJeu) : null;
        setActiviteRecommandee(jeu);
      } else {
        setActiviteRecommandee(null);
      }

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

  const emotionDetails = mapEmotion(questionnaireDuJour?.id_emotion);

  return {
    questionnaireDuJour,
    emotionDetails,
    activiteRecommandee,
    chargement,
    rafraichir: verifierQuestionnaireDuJour,
  };
};