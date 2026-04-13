import { execSql, queryAll } from "./baseDeDonnees";
import { nowSqlite } from "../utils/UtilsDate";
import { hashMotDePasse } from "../utils/Hash";

// INSCRIPTION & CONNEXION //
export async function creerCompteParent(email, motDePasse) {

  const motDePasseHash = await hashMotDePasse(motDePasse);
  const creeLe = nowSqlite();

  await execSql(
    `
    INSERT INTO compte_parent (email, mot_de_passe, cree_le)
    VALUES (?, ?, ?)
    `,
    [email, motDePasseHash, creeLe]
  );

  const rows = await queryAll(
    `
    SELECT id_parent, email, cree_le
    FROM compte_parent
    WHERE email = ?
    LIMIT 1
    `,
    [email]
  );

  return rows[0] ?? null;
}

export async function connecterParent(email, motDePasse) {

  const motDePasseHash = await hashMotDePasse(motDePasse);

  const rows = await queryAll(
    `
    SELECT id_parent, email, cree_le
    FROM compte_parent
    WHERE email = ? AND mot_de_passe = ?
    LIMIT 1
    `,
    [email, motDePasseHash]
  );

  return rows[0] ?? null;
}

export async function creerProfilEnfant(idParent, prenom, dateNaissance) {
  const creeLe = nowSqlite();
  await execSql(
    `
    INSERT INTO profil_enfant (id_parent, prenom, date_naissance, cree_le)
    VALUES (?, ?, ?, ?)
    `,
    [idParent, prenom, dateNaissance, creeLe]
  );

  const rows = await queryAll(
    `
    SELECT id_enfant, id_parent, prenom, date_naissance, cree_le
    FROM profil_enfant
    WHERE id_parent = ?
    ORDER BY id_enfant DESC
    LIMIT 1
    `,
    [idParent]
  );
  return rows[0] ?? null;
}

// COMPTE PARENT //

export async function listerEnfantsDuParent(idParent) {
  return queryAll(
    `
    SELECT id_enfant, prenom, date_naissance, cree_le
    FROM profil_enfant
    WHERE id_parent = ?
    ORDER BY prenom ASC
    `,
    [idParent]
  );
}

export async function supprimerProfilEnfant(idEnfant) {
  try {
    await queryAll("DELETE FROM questionnaire_emotionnel WHERE id_enfant = ?", [idEnfant]);
    
    await queryAll("DELETE FROM profil_enfant WHERE id_enfant = ?", [idEnfant]);
    
    return { success: true };
  } catch (error) {
    console.error("Erreur SQL suppression enfant :", error);
    throw error;
  }
}

// QUESTIONNAIRE EMOTIONNEL //

export async function creerQuestionnaireEmotionnel({
  idEnfant,
  idEmotion,
  intensiteEmotion,
  idSignalCorporel = null,
  idLieu = null,
  idCouleur = null,
  dateQuestionnaire = null,
}) {
  const dateSql = dateQuestionnaire ?? nowSqlite();

  await execSql(
      `
      INSERT INTO questionnaire_emotionnel (
        id_enfant,
        date_questionnaire,
        id_emotion,
        intensite_emotion,
        id_signal_corporel,
        id_lieu,
        id_couleur
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [ idEnfant, dateSql, idEmotion, intensiteEmotion, idSignalCorporel, idLieu, idCouleur,]
  );

  const rows = await queryAll(
    `
    SELECT *
    FROM questionnaire_emotionnel
    WHERE id_enfant = ?
    ORDER BY id_questionnaire DESC
    LIMIT 1
    `,
    [idEnfant]
  );

  return rows[0] ?? null;
}

export async function enregistrerQuestionnaire(questionnaire) {
  const {
    idEnfant,
    prenom,
    idEmotion,
    emotionLabel,
    intensiteEmotion,
    idSignalCorporel,
    corpsLabel,
    idLieu,
    lieuLabel,
  } = questionnaire;

  const dateDuJour = nowSqlite();
  console.log(dateDuJour);

  await execSql(
    `
    INSERT INTO questionnaire_emotionnel (
      id_enfant,
      date_questionnaire,
      id_emotion,
      intensite_emotion,
      id_signal_corporel,
      id_lieu,
      id_couleur
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      idEnfant,
      dateDuJour,
      idEmotion,
      intensiteEmotion,
      idSignalCorporel,
      idLieu,
      1, 
    ]
  );
}

export async function listerQuestionnairesEnfant(idEnfant) {
  return queryAll(
    `
    SELECT 
      q.*, 
      e.libelle AS emotion_nom,
      l.libelle AS lieu_nom,
      s.libelle AS signal_nom
    FROM questionnaire_emotionnel q
    LEFT JOIN catalogue_emotions e ON q.id_emotion = e.id_emotion
    LEFT JOIN catalogue_lieux l ON q.id_lieu = l.id_lieu
    LEFT JOIN catalogue_signaux_corporels s ON q.id_signal_corporel = s.id_signal_corporel
    WHERE q.id_enfant = ?
    ORDER BY q.date_questionnaire DESC
    `,
    [idEnfant]
  );
}

export async function getDernierQuestionnaireDuJour(idEnfant) {
  const resultats = await queryAll(
    `
      SELECT 
        q.*, 
        e.libelle AS emotion_nom
      FROM questionnaire_emotionnel q
      LEFT JOIN catalogue_emotions e ON q.id_emotion = e.id_emotion
      WHERE q.id_enfant = ? 
        AND date(q.date_questionnaire) = date('now', 'localtime')
      ORDER BY q.date_questionnaire DESC 
      LIMIT 1;
    `,
    [idEnfant]
  );

  return resultats.length > 0 ? resultats[0] : null;
}
