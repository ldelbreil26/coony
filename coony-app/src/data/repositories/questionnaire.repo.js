import {
  insertQuestionnaire,
  selectQuestionnairesByEnfant,
  selectLastQuestionnaire,
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

export function getDernierQuestionnaire(idEnfant) {
  return selectLastQuestionnaire(idEnfant);
}