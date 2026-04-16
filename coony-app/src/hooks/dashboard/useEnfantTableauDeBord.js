import { useState, useCallback, useEffect } from "react";
import { useFocusEffect } from "expo-router";
import { getDernierQuestionnaire } from "../../data/repositories/questionnaire.repo";
import { fetchMiniJeu } from "../../utils/mapper/miniJeuMapper";
import { mapEmotion } from "../../utils/mapper/emotionMapper";
import { getRecommandation } from "../../data/repositories/recommendation.repo";
import { MINI_JEUX_UI } from "../../utils/mapper/miniJeuMapper";

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

  const [miniJeux, setMiniJeux] = useState([]);
  const emotionDetails = mapEmotion(questionnaireDuJour?.id_emotion);

  const getRandomMiniJeuxIds = (count = 3) => {
  if (!MINI_JEUX_UI) return [];

  const ids = Object.keys(MINI_JEUX_UI).map(Number);

  return ids
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
};

  useEffect(() => {
    const load = async () => {
      const ids = getRandomMiniJeuxIds(3);

      const jeux = await Promise.all(
        ids.map((id) => fetchMiniJeu(id))
      );

      setMiniJeux(jeux);
    };

    load();
  }, []);

  return {
    questionnaireDuJour,
    emotionDetails,
    activiteRecommandee,
    chargement,
    miniJeux,
    rafraichir: verifierQuestionnaireDuJour,
  };
};