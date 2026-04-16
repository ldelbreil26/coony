import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { listerEnfantsDuParent } from "../../data/repositories/enfant.repo";
import { listerQuestionnairesEnfant } from "../../data/repositories/questionnaire.repo";

export const useParentTableauDeBord = (parentConnecte) => {
  const [enfants, setEnfants] = useState([]);
  const [enfantSelectionne, setEnfantSelectionne] = useState(null);
  const [questionnaires, setQuestionnaires] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Renommé pour correspondre à la vue

  const chargerHistorique = async (idEnfant) => {
    try {
      const listeQuestionnaires = await listerQuestionnairesEnfant(idEnfant);
      setQuestionnaires(listeQuestionnaires);
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
    rafraichir: chargerDonneesInitiales
  };
};