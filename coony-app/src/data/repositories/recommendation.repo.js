import { insertRecommandation, selectRecommandation } from "../sqlite/queries";

export function creerRecommandation(idQuestionnaire, date, idMiniJeu) {
  return insertRecommandation(idQuestionnaire, date, idMiniJeu);
}

export function getRecommandation(idQuestionnaire) {
  return selectRecommandation(idQuestionnaire);
}