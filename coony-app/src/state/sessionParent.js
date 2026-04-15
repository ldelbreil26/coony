import { createContext, useContext, useState } from "react";

const SessionParentContext = createContext();

export function SessionParentProvider({ children }) {
  const [parentConnecte, setParentConnecte] = useState(null);

  return (
    <SessionParentContext.Provider value={{ parentConnecte, setParentConnecte }}>
      {children}
    </SessionParentContext.Provider>
  );
}

export function useSessionParent() {
  const ctx = useContext(SessionParentContext);

  if (!ctx) {
    throw new Error(
      "useSessionParent doit être utilisé dans SessionParentProvider."
    );
  }

  return ctx;
}