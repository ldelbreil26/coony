import { insertRecommandation, selectRecommandation } from "../sqlite/queries";

/**
 * Crée une recommandation associée à un questionnaire.
 *
 * @param {number} idQuestionnaire - Identifiant du questionnaire source.
 * @param {string} date            - Date de la recommandation (format YYYY-MM-DD).
 * @param {number} idMiniJeu       - Identifiant du mini-jeu recommandé.
 * @returns {Promise<void>}
 */
export function creerRecommandation(idQuestionnaire, date, idMiniJeu) {
  return insertRecommandation(idQuestionnaire, date, idMiniJeu);
}

/**
 * Récupère l'identifiant du mini-jeu recommandé pour un questionnaire donné.
 *
 * @param {number} idQuestionnaire - Identifiant du questionnaire.
 * @returns {Promise<number|null>} L'identifiant du mini-jeu, ou null si aucune recommandation trouvée.
 */
export async function getRecommandation(idQuestionnaire) {
  if (!idQuestionnaire) return null;
  const row = await selectRecommandation(idQuestionnaire);
  return row?.id_mini_jeu ?? null;
}