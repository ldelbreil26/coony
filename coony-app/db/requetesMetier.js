import { execSql, queryAll } from "./baseDeDonnees";

function nowSqlite() {
  return new Date().toISOString().slice(0, 19).replace("T", " ");
}

export async function creerCompteParent(email, motDePasse) {
  const creeLe = nowSqlite();
  await execSql(
    `
    INSERT INTO compte_parent (email, mot_de_passe, cree_le)
    VALUES (?, ?, ?)
    `,
    [email, motDePasse, creeLe]
  );

  const rows = await queryAll(
    "SELECT id_parent, email, cree_le, actif FROM compte_parent WHERE email = ? LIMIT 1",
    [email]
  );
  return rows[0] ?? null;
}

export async function connecterParent(email, motDePasse) {
  const rows = await queryAll(
    `
    SELECT id_parent, email, cree_le, actif
    FROM compte_parent
    WHERE email = ? AND mot_de_passe = ? AND actif = 1
    LIMIT 1
    `,
    [email, motDePasse]
  );
  return rows[0] ?? null;
}

export async function desactiverParent(idParent) {
  await execSql(
    "UPDATE compte_parent SET actif = 0 WHERE id_parent = ?",
    [idParent]
  );
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

export async function recupererEnfant(idEnfant) {
  const rows = await queryAll(
    `
    SELECT id_enfant, id_parent, prenom, date_naissance, cree_le
    FROM profil_enfant
    WHERE id_enfant = ?
    LIMIT 1
    `,
    [idEnfant]
  );
  return rows[0] ?? null;
}

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

  if (dateQuestionnaire) {
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
      [ idEnfant, dateQuestionnaire, idEmotion, intensiteEmotion, idSignalCorporel, idLieu, idCouleur,]
    );

  } else {
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
      VALUES (?, datetime('now'), ?, ?, ?, ?, ?)
      `,
      [idEnfant, idEmotion, intensiteEmotion, idSignalCorporel, idLieu, idCouleur]
    );
  }

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

export async function listerQuestionnairesEnfant(idEnfant) {
  return queryAll(
    `
    SELECT *
    FROM questionnaire_emotionnel
    WHERE id_enfant = ?
    ORDER BY date_questionnaire DESC
    `,
    [idEnfant]
  );
}