/**
 * @file useEnfantTableauDeBord.js
 * @description Hook personnalisé qui gère la logique du tableau de bord enfant.
 * 
 * Architecture :
 * - Ce hook sert de pont entre la couche de données (repositories) et l'interface utilisateur (PageTableauBordEnfant).
 * - Il gère le cycle de vie des données du tableau de bord : récupération du dernier questionnaire,
 *   mappage des IDs d'émotions bruts vers des détails conviviaux pour l'UI, et récupération des activités recommandées.
 * - Il assure le rafraîchissement des données lorsque l'écran revient au premier plan.
 */

import { useState, useCallback, useEffect } from "react";
import { useFocusEffect } from "expo-router";
import { getDernierQuestionnaire } from "../../data/repositories/questionnaire.repo";
import { fetchMiniJeu } from "../../utils/mapper/miniJeuMapper";
import { mapEmotion } from "../../utils/mapper/emotionMapper";
import { getRecommandation } from "../../data/repositories/recommendation.repo";
import { MINI_JEUX_UI } from "../../utils/mapper/miniJeuMapper";

/**
 * Hook pour gérer l'état du tableau de bord enfant et la récupération des données.
 * 
 * @param {Object} enfantSelectionne - L'objet de l'enfant actuellement sélectionné.
 * @returns {Object} {
 *   questionnaireDuJour: Object|null, - Données du dernier questionnaire complété
 *   emotionDetails: Object, - Détails UI pour l'émotion actuelle
 *   activiteRecommandee: Object|null, - Mini-jeu recommandé basé sur l'humeur
 *   chargement: boolean, - État de chargement
 *   miniJeux: Array, - Liste de mini-jeux aléatoires
 *   rafraichir: Function - Fonction pour rafraîchir manuellement les données du tableau de bord
 * }
 */
export const useEnfantTableauDeBord = (enfantSelectionne) => {
  const [questionnaireDuJour, setQuestionnaireDuJour] = useState(null);
  const [activiteRecommandee, setActiviteRecommandee] = useState(null);
  const [chargement, setChargement] = useState(true);

  /**
   * Récupère le dernier questionnaire et sa recommandation associée depuis les repositories.
   */
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

  /**
   * Rafraîchit les données chaque fois que l'écran du tableau de bord est focalisé.
   */
  useFocusEffect(
    useCallback(() => {
      verifierQuestionnaireDuJour();
    }, [enfantSelectionne]),
  );

  const [miniJeux, setMiniJeux] = useState([]);
  const emotionDetails = mapEmotion(questionnaireDuJour?.id_emotion);

  /**
   * Sélectionne des IDs de mini-jeux aléatoires dans le catalogue.
   * 
   * @param {number} count - Nombre d'IDs à retourner.
   * @returns {Array<number>}
   */
  const getRandomMiniJeuxIds = (count = 3) => {
  if (!MINI_JEUX_UI) return [];

  const ids = Object.keys(MINI_JEUX_UI).map(Number);

  return ids
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
};

  /**
   * Chargement initial de mini-jeux aléatoires.
   */
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