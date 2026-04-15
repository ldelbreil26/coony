import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { listerEnfantsDuParent } from "../../data/repositories/enfant.repo";
import { listerQuestionnairesEnfant } from "../../data/repositories/questionnaire.repo";

export const useParentTableauDeBord = (parentConnecte) => {
  const [enfants, setEnfants] = useState([]);
  const [enfantSelectionne, setEnfantSelectionne] = useState(null);
  const [questionnaires, setQuestionnaires] = useState([]);
  const [chargement, setChargement] = useState(true);

  const chargerHistorique = async (idEnfant) => {
    try {
      const listeQuestionnaires = await listerQuestionnairesEnfant(idEnfant);
      setQuestionnaires(listeQuestionnaires);
    } catch (error) {
      console.error("Erreur chargement historique :", error);
    }
  };

  const chargerListeEnfants = async () => {
    try {
      if (!parentConnecte?.id_parent) return;
      setChargement(true);
      const liste = await listerEnfantsDuParent(parentConnecte.id_parent);
      setEnfants(liste);

      if (liste.length > 0) {
        const currentSelection = enfantSelectionne || liste[0];
        setEnfantSelectionne(currentSelection);
        await chargerHistorique(currentSelection.id_enfant);
      }
    } catch (error) {
      console.error("Erreur chargement enfants :", error);
    } finally {
      setChargement(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      chargerListeEnfants();
    }, [parentConnecte])
  );

  const changerEnfant = (enfant) => {
    setEnfantSelectionne(enfant);
    chargerHistorique(enfant.id_enfant);
  };

  return {
    enfants,
    enfantSelectionne,
    questionnaires,
    chargement,
    changerEnfant,
    rafraichir: chargerListeEnfants
  };
};
