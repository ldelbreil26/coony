import {
  insertEnfant,
  selectEnfantsByParent,
  selectLastEnfantByParent,
  deleteEnfant,
  deleteQuestionnairesByEnfant,
} from "../sqlite/queries";
import { nowSqlite } from "../../utils/date";

/**
 * Crée un profil enfant associé à un parent et retourne le profil créé.
 *
 * @param {number} idParent      - Identifiant du parent.
 * @param {string} prenom        - Prénom de l'enfant.
 * @param {string} dateNaissance - Date de naissance de l'enfant (format YYYY-MM-DD).
 * @returns {Promise<Object>}    Le profil enfant nouvellement créé.
 */
export async function creerProfilEnfant(idParent, prenom, dateNaissance) {
  const date = nowSqlite();

  await insertEnfant(idParent, prenom, dateNaissance, date);

  return selectLastEnfantByParent(idParent);
}

/**
 * Retourne la liste des enfants associés à un parent.
 *
 * @param {number} idParent   - Identifiant du parent.
 * @returns {Promise<Array>}  Liste des profils enfants du parent.
 */
export function listerEnfantsDuParent(idParent) {
  return selectEnfantsByParent(idParent);
}

/**
 * Supprime un profil enfant ainsi que tous ses questionnaires associés.
 *
 * @param {number} idEnfant    - Identifiant de l'enfant à supprimer.
 * @returns {Promise<boolean>} true si la suppression s'est déroulée avec succès.
 */
export async function supprimerProfilEnfant(idEnfant) {
  await deleteQuestionnairesByEnfant(idEnfant);
  await deleteEnfant(idEnfant);
  return true;
}