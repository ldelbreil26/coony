/**
 * @file enfantSelectionne.js
 * @description Gestion de l'état pour l'enfant actuellement sélectionné.
 * 
 * Architecture :
 * - Utilise l'API Context de React pour partager l'enfant actif à travers l'application.
 * - Ceci est critique pour le tableau de bord de l'enfant et le questionnaire, qui dépendent
 *   des données spécifiques de l'enfant (ID, nom, etc.).
 */

import { createContext, useContext, useState } from "react";

const EnfantSelectionneContext = createContext(null);

/**
 * Composant Provider pour l'état de l'enfant sélectionné.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export function EnfantSelectionneProvider({ children }) {
  const [enfantSelectionne, setEnfantSelectionne] = useState(null);

  return (
    <EnfantSelectionneContext.Provider
      value={{ enfantSelectionne, setEnfantSelectionne }}
    >
      {children}
    </EnfantSelectionneContext.Provider>
  );
}

/**
 * Hook personnalisé pour accéder au contexte de l'enfant actuellement sélectionné.
 * 
 * @throws {Error} Si utilisé en dehors d'un EnfantSelectionneProvider.
 * @returns {Object} { enfantSelectionne, setEnfantSelectionne }
 */
export function useEnfantSelectionne() {
  const ctx = useContext(EnfantSelectionneContext);

  if (!ctx) {
    throw new Error(
      "useEnfantSelectionne doit être utilisé dans EnfantSelectionneProvider."
    );
  }

  return ctx;
}