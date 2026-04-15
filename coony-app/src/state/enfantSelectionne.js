import { createContext, useContext, useState } from "react";

const EnfantSelectionneContext = createContext(null);

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
  const ctx = useContext(EnfantSelectionneContext);

  if (!ctx) {
    throw new Error(
      "useEnfantSelectionne doit être utilisé dans EnfantSelectionneProvider."
    );
  }

  return ctx;
}