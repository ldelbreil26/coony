import { createContext, useContext, useState } from "react";

const QuestionnaireContext = createContext();

export function QuestionnaireProvider({ children }) {
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

  const mettreAJourQuestionnaire = (nouvellesValeurs) => {
    setQuestionnaire((precedent) => ({
      ...precedent,
      ...nouvellesValeurs,
    }));
  };

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

export function useQuestionnaire() {
  const context = useContext(QuestionnaireContext);

  if (!context) {
    throw new Error(
      "useQuestionnaire doit être utilisé dans QuestionnaireProvider."
    );
  }

  return context;
}