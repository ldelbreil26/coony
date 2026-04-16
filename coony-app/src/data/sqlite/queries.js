import { exec, queryOne, queryMany } from "./client";

// -------------------- PARENT --------------------

export const insertParent = (email, hash, date) =>
  exec(
    `INSERT INTO compte_parent (email, mot_de_passe, cree_le)
     VALUES (?, ?, ?)`,
    [email, hash, date]
  );

export const selectParentByEmail = (email) =>
  queryOne(
    `SELECT id_parent, email, cree_le
     FROM compte_parent
     WHERE email = ?`,
    [email]
  );

export const selectParentLogin = (email, hash) =>
  queryOne(
    `SELECT id_parent, email, cree_le
     FROM compte_parent
     WHERE email = ? AND mot_de_passe = ?`,
    [email, hash]
  );

// -------------------- ENFANT --------------------

export const insertEnfant = (idParent, prenom, dateNaissance, date) =>
  exec(
    `INSERT INTO profil_enfant (id_parent, prenom, date_naissance, cree_le)
     VALUES (?, ?, ?, ?)`,
    [idParent, prenom, dateNaissance, date]
  );

export const selectEnfantsByParent = (idParent) =>
  queryMany(
    `SELECT id_enfant, prenom, date_naissance, cree_le
     FROM profil_enfant
     WHERE id_parent = ?
     ORDER BY prenom ASC`,
    [idParent]
  );

export const selectLastEnfantByParent = (idParent) =>
  queryOne(
    `SELECT id_enfant, id_parent, prenom, date_naissance, cree_le
     FROM profil_enfant
     WHERE id_parent = ?
     ORDER BY id_enfant DESC`,
    [idParent]
  );

export const deleteEnfant = (idEnfant) =>
  exec(`DELETE FROM profil_enfant WHERE id_enfant = ?`, [idEnfant]);

export const deleteQuestionnairesByEnfant = (idEnfant) =>
  exec(`DELETE FROM questionnaire_emotionnel WHERE id_enfant = ?`, [
    idEnfant,
  ]);

// -------------------- QUESTIONNAIRE --------------------

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

// -------------------- RECOMMANDATION --------------------

export const insertRecommandation = (idQuestionnaire, date, idMiniJeu) =>
  exec(
    `INSERT INTO recommandation (
      id_questionnaire,
      cree_le,
      id_mini_jeu
    ) VALUES (?, ?, ?)`,
    [idQuestionnaire, date, idMiniJeu]
  );

export const selectRecommandation = (idQuestionnaire) =>
  queryOne(
    `SELECT id_mini_jeu
     FROM recommandation
     WHERE id_questionnaire = ?`,
    [idQuestionnaire]
  );

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