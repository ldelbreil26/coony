/**
 * @module QuestionnaireState
 * @description Gestion de l'état global du questionnaire en cours.
 * Utilise l'API Context de React pour partager les réponses de l'enfant entre 
 * les différentes étapes (écrans) du tunnel de questions.
 */

import { createContext, useContext, useState } from "react";

/**
 * Contexte React pour le questionnaire.
 */
const QuestionnaireContext = createContext();

/**
 * Composant Provider qui enveloppe l'application (ou une partie) pour fournir l'état du questionnaire.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Les composants enfants ayant accès au contexte.
 */
export function QuestionnaireProvider({ children }) {
  /**
   * État structuré du questionnaire.
   * Regroupe l'identité de l'enfant et ses réponses émotionnelles/corporelles/temporelles.
   */
  const [questionnaire, setQuestionnaire] = useState({
    idEnfant: null,
    prenom: null,
    
    idEmotion: null,
    emotionLabel: null,
    intensiteEmotion: null,

    idSignalCorporel: null,
    signalLabel: null,

    idLieu: null,
    lieuLabel: null,
  });

  /**
   * Met à jour partiellement l'état du questionnaire (Merge state).
   * @param {Object} nouvellesValeurs - Objet contenant les champs à modifier.
   */
  const mettreAJourQuestionnaire = (nouvellesValeurs) => {
    setQuestionnaire((precedent) => ({
      ...precedent,
      ...nouvellesValeurs,
    }));
  };

  /**
   * Réinitialise le questionnaire à ses valeurs par défaut (ex: après finalisation).
   */
  const reinitialiserQuestionnaire = () => {
    setQuestionnaire({
      idEnfant: null,
      prenom: null,
      idEmotion: null,
      emotionLabel: null,
      intensiteEmotion: null,
      idSignalCorporel: null,
      signalLabel: null,
      idLieu: null,
      lieuLabel: null,
    });
  };

  return (
    <QuestionnaireContext.Provider
      value={{
        questionnaire,
        mettreAJourQuestionnaire,
        reinitialiserQuestionnaire,
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
}

/**
 * Hook personnalisé pour consommer facilement le contexte du questionnaire.
 * @returns {Object} { questionnaire, mettreAJourQuestionnaire, reinitialiserQuestionnaire }
 * @throws {Error} Si utilisé en dehors d'un QuestionnaireProvider.
 */
export function useQuestionnaire() {
  const context = useContext(QuestionnaireContext);

  if (!context) {
    throw new Error(
      "useQuestionnaire doit être utilisé dans QuestionnaireProvider."
    );
  }

  return context;
}