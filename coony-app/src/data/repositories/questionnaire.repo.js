/**
 * @module QuestionnaireRepository
 * @description Repository pour les questionnaires émotionnels.
 * Implémente le "Repository Pattern" pour isoler la logique d'accès aux données 
 * de la logique métier. Ce module fait le pont entre les queries SQL brutes et 
 * les besoins de l'interface utilisateur.
 */

import {
  insertQuestionnaire,
  selectLastQuestionnaire,
  selectQuestionnairesByEnfant,
} from "../sqlite/queries";

import { nowSqlite } from "../../utils/date";

/**
 * Crée et enregistre un nouveau questionnaire complété par l'enfant.
 * 
 * @param {Object} data - Les données du questionnaire.
 * @param {number} data.idEnfant
 * @param {number} data.idEmotion
 * @param {number} data.intensiteEmotion
 * @param {number} data.idSignalCorporel
 * @param {number} data.idLieu
 * @param {string} [data.dateQuestionnaire] - Optionnel (utilise la date actuelle par défaut).
 * @returns {Promise<number>} L'identifiant du questionnaire créé.
 */
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

/**
 * Récupère le dernier questionnaire saisi par l'enfant pour la date d'aujourd'hui.
 * Utilisé pour afficher un résumé ou éviter les doublons trop fréquents.
 * 
 * @param {number} idEnfant 
 * @returns {Promise<any|null>}
 */
export async function getDernierQuestionnaire(idEnfant) {
  const d = new Date();
  const aujourdhui = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

  return selectLastQuestionnaire(idEnfant, aujourdhui);
}