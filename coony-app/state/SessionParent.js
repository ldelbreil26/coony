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
  return useContext(SessionParentContext);
}
