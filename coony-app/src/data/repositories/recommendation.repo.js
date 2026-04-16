import { insertRecommandation, selectRecommandation } from "../sqlite/queries";

export function creerRecommandation(idQuestionnaire, date, idMiniJeu) {
  return insertRecommandation(idQuestionnaire, date, idMiniJeu);
}

export async function getRecommandation(idQuestionnaire) {
  if (!idQuestionnaire) return null;
  const row = await selectRecommandation(idQuestionnaire);
  return row?.id_mini_jeu ?? null;
}