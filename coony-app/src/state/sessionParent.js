/**
 * @file sessionParent.js
 * @description Gestion de l'état de la session du parent.
 * 
 * Architecture :
 * - Utilise l'API Context de React pour fournir les données du parent à l'ensemble de l'application.
 * - Cela permet à n'importe quel composant ou hook (ex: `useConnexionParent`) d'accéder ou de mettre à jour
 *   la session du parent sans passer par les props (prop drilling).
 */

import { createContext, useContext, useState } from "react";

const SessionParentContext = createContext();

/**
 * Composant Provider pour l'état de la session du parent.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export function SessionParentProvider({ children }) {
  const [parentConnecte, setParentConnecte] = useState(null);

  return (
    <SessionParentContext.Provider value={{ parentConnecte, setParentConnecte }}>
      {children}
    </SessionParentContext.Provider>
  );
}

/**
 * Hook personnalisé pour accéder au contexte de session du parent.
 * 
 * @throws {Error} Si utilisé en dehors d'un SessionParentProvider.
 * @returns {Object} { parentConnecte, setParentConnecte }
 */
export function useSessionParent() {
  const ctx = useContext(SessionParentContext);

  if (!ctx) {
    throw new Error(
      "useSessionParent doit être utilisé dans SessionParentProvider."
    );
  }

  return ctx;
}