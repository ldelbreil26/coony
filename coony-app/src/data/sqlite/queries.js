/**
 * @module Queries
 * @description Centralisation de toutes les requêtes SQL (Data Access Object Layer).
 * Ce fichier contient les instructions SQL brutes et utilise le client SQLite pour
 * l'exécution. Les méthodes sont groupées par domaine fonctionnel.
 */

import { exec, queryOne, queryMany } from "./client";

// -----------------------------------------------------------------------------
// DOMAINE : PARENT
// Gestion des comptes parents et de l'authentification
// -----------------------------------------------------------------------------

/**
 * Insère un nouveau compte parent dans la base.
 */
export const insertParent = (email, hash, date) =>
  exec(
    `INSERT INTO compte_parent (email, mot_de_passe, cree_le)
     VALUES (?, ?, ?)`,
    [email, hash, date]
  );

/**
 * Recherche un parent par son email (pour vérifier l'unicité).
 */
export const selectParentByEmail = (email) =>
  queryOne(
    `SELECT id_parent, email, cree_le
     FROM compte_parent
     WHERE email = ?`,
    [email]
  );

/**
 * Tente d'authentifier un parent avec son email et son mot de passe haché.
 */
export const selectParentLogin = (email, hash) =>
  queryOne(
    `SELECT id_parent, email, cree_le
     FROM compte_parent
     WHERE email = ? AND mot_de_passe = ?`,
    [email, hash]
  );

// -----------------------------------------------------------------------------
// DOMAINE : ENFANT
// Gestion des profils d'enfants rattachés à un parent
// -----------------------------------------------------------------------------

/**
 * Ajoute un nouvel enfant à un compte parent.
 */
export const insertEnfant = (idParent, prenom, dateNaissance, date) =>
  exec(
    `INSERT INTO profil_enfant (id_parent, prenom, date_naissance, cree_le)
     VALUES (?, ?, ?, ?)`,
    [idParent, prenom, dateNaissance, date]
  );

/**
 * Liste tous les enfants rattachés à un parent spécifique.
 */
export const selectEnfantsByParent = (idParent) =>
  queryMany(
    `SELECT id_enfant, prenom, date_naissance, cree_le
     FROM profil_enfant
     WHERE id_parent = ?
     ORDER BY prenom ASC`,
    [idParent]
  );

/**
 * Récupère le dernier enfant ajouté (utile après la création du profil).
 */
export const selectLastEnfantByParent = (idParent) =>
  queryOne(
    `SELECT id_enfant, id_parent, prenom, date_naissance, cree_le
     FROM profil_enfant
     WHERE id_parent = ?
     ORDER BY id_enfant DESC`,
    [idParent]
  );

/**
 * Supprime définitivement un profil enfant.
 */
export const deleteEnfant = (idEnfant) =>
  exec(`DELETE FROM profil_enfant WHERE id_enfant = ?`, [idEnfant]);

/**
 * Nettoyage des questionnaires d'un enfant (Cascade manuelle).
 */
export const deleteQuestionnairesByEnfant = (idEnfant) =>
  exec(`DELETE FROM questionnaire_emotionnel WHERE id_enfant = ?`, [
    idEnfant,
  ]);

// -----------------------------------------------------------------------------
// DOMAINE : QUESTIONNAIRE
// Enregistrement et lecture des bilans émotionnels quotidiens
// -----------------------------------------------------------------------------

/**
 * Enregistre un check-in complet.
 */
export const insertQuestionnaire = (
  idEnfant,
  date,
  idEmotion,
  intensite,
  idSignal,
  idLieu
) =>
  exec(
    `INSERT INTO questionnaire_emotionnel (
      id_enfant,
      date_questionnaire,
      id_emotion,
      intensite_emotion,
      id_signal_corporel,
      id_lieu
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    [idEnfant, date, idEmotion, intensite, idSignal, idLieu]
  );

/**
 * Récupère l'historique d'un enfant avec les libellés descriptifs (JOIN).
 */
export const selectQuestionnairesByEnfant = (idEnfant) =>
  queryMany(
    `SELECT 
      q.*,
      e.libelle as emotion_nom, 
      l.libelle AS lieu_nom,
      s.libelle AS signal_nom
     FROM questionnaire_emotionnel q
     LEFT JOIN catalogue_emotions e ON q.id_emotion = e.id_emotion
     LEFT JOIN catalogue_lieux l ON q.id_lieu = l.id_lieu
     LEFT JOIN catalogue_signaux_corporels s ON q.id_signal_corporel = s.id_signal_corporel
     WHERE q.id_enfant = ?
     ORDER BY q.date_questionnaire DESC`,
    [idEnfant]
  );

/**
 * Cherche le dernier questionnaire saisi aujourd'hui.
 */
export const selectLastQuestionnaire = (idEnfant, aujourdhui) =>
  queryOne(
    `SELECT 
        q.*, 
        e.libelle as emotion_nom, 
        s.libelle as corps_nom
      FROM questionnaire_emotionnel q
      LEFT JOIN catalogue_emotions e ON q.id_emotion = e.id_emotion
      LEFT JOIN catalogue_signaux_corporels s ON q.id_signal_corporel = s.id_signal_corporel
      WHERE q.id_enfant = ?
        AND SUBSTR(q.date_questionnaire, 1, 10) = ?
      ORDER BY q.date_questionnaire DESC
      LIMIT 1`,
    [idEnfant, aujourdhui]
  );

// -----------------------------------------------------------------------------
// DOMAINE : RECOMMANDATION & CATALOGUE
// Liens entre bilans et activités proposées
// -----------------------------------------------------------------------------

/**
 * Enregistre le choix du mini-jeu proposé à l'enfant suite à son bilan.
 */
export const insertRecommandation = (idQuestionnaire, date, idMiniJeu) =>
  exec(
    `INSERT INTO recommandation (
      id_questionnaire,
      cree_le,
      id_mini_jeu
    ) VALUES (?, ?, ?)`,
    [idQuestionnaire, date, idMiniJeu]
  );

/**
 * Récupère le mini-jeu associé à un questionnaire.
 */
export const selectRecommandation = (idQuestionnaire) =>
  queryOne(
    `SELECT id_mini_jeu
     FROM recommandation
     WHERE id_questionnaire = ?`,
    [idQuestionnaire]
  );

/**
 * Accès au catalogue statique des mini-jeux.
 */
export const selectMiniJeu = (idMinIJeu) =>
  queryOne(
    `
      SELECT *
      FROM catalogue_mini_jeux
      WHERE id_mini_jeu = ?
      LIMIT 1
    `,
    [idMinIJeu],
  );