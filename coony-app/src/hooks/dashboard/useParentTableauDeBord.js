import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { listerEnfantsDuParent } from "../../data/repositories/enfant.repo";
import { listerQuestionnairesEnfant } from "../../data/repositories/questionnaire.repo";
import { getDateDuJourFormatee } from "../../utils/date";
import { mapEmotion } from "../../utils/mapper/emotionMapper";
import { getRecommandation } from "../../data/repositories/recommendation.repo";
import { fetchMiniJeu } from "../../utils/mapper/miniJeuMapper";

export const useParentTableauDeBord = (parentConnecte) => {
  const [enfants, setEnfants] = useState([]);
  const [enfantSelectionne, setEnfantSelectionne] = useState(null);
  const [activiteRecommandee, setActiviteRecommandee] = useState(null);
  const [questionnaires, setQuestionnaires] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Renommé pour correspondre à la vue

  const dateDuJour = getDateDuJourFormatee();
  
  const dernierQuestionnaire = questionnaires.length > 0 ? questionnaires[0] : null;
  const emotionDetails = mapEmotion(dernierQuestionnaire?.id_emotion);

  const chargerHistorique = async (idEnfant) => {
    try {
      const listeQuestionnaires = await listerQuestionnairesEnfant(idEnfant);
      setQuestionnaires(listeQuestionnaires);

      const questionnaireLePlusRecent = listeQuestionnaires.length > 0 ? listeQuestionnaires[0] : null;
      if(questionnaireLePlusRecent?.id_questionnaire) {
        const idMiniJeu = await getRecommandation(questionnaireLePlusRecent.id_questionnaire);
        const jeu = idMiniJeu ? await fetchMiniJeu(idMiniJeu) : null;
        setActiviteRecommandee(jeu);
      } else {
        setActiviteRecommandee(null);
      }

    } catch (error) {
      console.error("Erreur chargement historique :", error);
    }
  };

  const chargerDonneesInitiales = async () => {
    if (!parentConnecte?.id_parent) return;

    try {
      setIsLoading(true);
      const liste = await listerEnfantsDuParent(parentConnecte.id_parent);
      setEnfants(liste);

      if (liste.length > 0) {
        // On garde l'enfant déjà sélectionné s'il existe toujours dans la nouvelle liste
        const enfantARecupérer = enfantSelectionne 
          ? liste.find(e => e.id_enfant === enfantSelectionne.id_enfant) || liste[0]
          : liste[0];
        
        setEnfantSelectionne(enfantARecupérer);
        await chargerHistorique(enfantARecupérer.id_enfant);
      }
    } catch (error) {
      console.error("Erreur chargement tableau de bord :", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      chargerDonneesInitiales();
    }, [parentConnecte?.id_parent]) // Dépendance plus précise
  );

  const changerEnfant = async (enfant) => {
    setEnfantSelectionne(enfant);
    // On peut mettre un petit état de chargement local ici si l'historique est long à charger
    await chargerHistorique(enfant.id_enfant);
  };

  return {
    enfants,
    enfantSelectionne,
    questionnaires,
    isLoading, // On retourne isLoading
    changerEnfant,
    dateDuJour,
    dernierQuestionnaire,
    emotionDetails,
    activiteRecommandee,
    rafraichir: chargerDonneesInitiales
  };
};