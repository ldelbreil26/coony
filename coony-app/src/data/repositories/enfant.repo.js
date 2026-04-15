import {
  insertEnfant,
  selectEnfantsByParent,
  selectLastEnfantByParent,
  deleteEnfant,
  deleteQuestionnairesByEnfant,
} from "../sqlite/queries";
import { nowSqlite } from "../../utils/date";

export async function creerProfilEnfant(idParent, prenom, dateNaissance) {
  const date = nowSqlite();

  await insertEnfant(idParent, prenom, dateNaissance, date);

  return selectLastEnfantByParent(idParent);
}

export function listerEnfantsDuParent(idParent) {
  return selectEnfantsByParent(idParent);
}

export async function supprimerProfilEnfant(idEnfant) {
  await deleteQuestionnairesByEnfant(idEnfant);
  await deleteEnfant(idEnfant);
  return true;
}