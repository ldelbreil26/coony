import { createContext, useContext, useState } from "react";

const EnfantSelectionneContext = createContext();

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

export function useEnfantSelectionne() {
  const context = useContext(EnfantSelectionneContext);

  if (!context) {
    throw new Error(
      "useEnfantSelectionne doit être utilisé dans EnfantSelectionneProvider"
    );
  }

  return context;
}