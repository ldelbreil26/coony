import {
  insertQuestionnaire,
  selectLastQuestionnaire,
  selectQuestionnairesByEnfant,
} from "../sqlite/queries";

import { nowSqlite } from "../../utils/date";

export async function creerQuestionnaire({
  idEnfant, idEmotion, intensiteEmotion, idSignalCorporel, idLieu, dateQuestionnaire,
}) {
  const date = dateQuestionnaire ?? nowSqlite();
  const id = await insertQuestionnaire(
    idEnfant, date, idEmotion, intensiteEmotion, idSignalCorporel, idLieu
  );
  return id;
}

export function listerQuestionnairesEnfant(idEnfant) {
  return selectQuestionnairesByEnfant(idEnfant);
}

export async function getDernierQuestionnaire(idEnfant) {
  const d = new Date();
  const aujourdhui = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

  return selectLastQuestionnaire(idEnfant, aujourdhui);
}