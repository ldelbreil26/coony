import { execSql, queryAll } from "./baseDeDonnees";
import { nowSqlite } from "../utils/UtilsDate";
import { hashMotDePasse } from "../utils/Hash";
import { matchRecommandation } from "../services/serviceRecommandation"; // Vérifie ton chemin

// INSCRIPTION & CONNEXION //
export async function creerCompteParent(email, motDePasse) {
  const motDePasseHash = await hashMotDePasse(motDePasse);
  const creeLe = nowSqlite();

  try {
    // 1. Tentative d'insertion
    await execSql(
      `
      INSERT INTO compte_parent (email, mot_de_passe, cree_le)
      VALUES (?, ?, ?)
      `,
      [email, motDePasseHash, creeLe],
    );
  } catch (error) {
    // 2. Interception de la contrainte d'unicité (Email déjà présent)
    // On vérifie si le message d'erreur contient "UNIQUE" ou le code 1555 (SQLite)
    if (error.message.includes("UNIQUE") || error.message.includes("1555")) {
      throw new Error("Cet email est déjà utilisé"); 
    }
    // Si c'est une autre erreur, on la relance telle quelle
    throw error;
  }

  // 3. Récupération du compte créé
  const rows = await queryAll(
    `
    SELECT id_parent, email, cree_le
    FROM compte_parent
    WHERE email = ?
    LIMIT 1
    `,
    [email],
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
    [email, motDePasseHash],
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
    [idParent, prenom, dateNaissance, creeLe],
  );

  const rows = await queryAll(
    `
    SELECT id_enfant, id_parent, prenom, date_naissance, cree_le
    FROM profil_enfant
    WHERE id_parent = ?
    ORDER BY id_enfant DESC
    LIMIT 1
    `,
    [idParent],
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
    [idParent],
  );
}

export async function supprimerProfilEnfant(idEnfant) {
  try {
    await queryAll("DELETE FROM questionnaire_emotionnel WHERE id_enfant = ?", [
      idEnfant,
    ]);

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
        id_lieu
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
    [idEnfant, dateSql, idEmotion, intensiteEmotion, idSignalCorporel, idLieu],
  );

  const rows = await queryAll(
    `
    SELECT *
    FROM questionnaire_emotionnel
    WHERE id_enfant = ?
    ORDER BY id_questionnaire DESC
    LIMIT 1
    `,
    [idEnfant],
  );

  return rows[0] ?? null;
}

export async function getMiniJeux(idMinIJeu) {
  const rows = await queryAll(
    `
      SELECT *
      FROM catalogue_mini_jeux
      WHERE id_mini_jeu = ?
      LIMIT 1
    `,
    [idMinIJeu],
  );

  return rows[0] ?? null;
}

export async function enregistrerQuestionnaire(questionnaire) {
  const { idEnfant, idEmotion, intensiteEmotion, idSignalCorporel, idLieu } =
    questionnaire;

  const dateMaintenant = nowSqlite();

  try {
    // A. INSERTION DU QUESTIONNAIRE
    const resultQ = await execSql(
      `INSERT INTO questionnaire_emotionnel (id_enfant, date_questionnaire, id_emotion, intensite_emotion, id_signal_corporel, id_lieu)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        idEnfant,
        dateMaintenant,
        idEmotion,
        intensiteEmotion,
        idSignalCorporel,
        idLieu,
        1,
      ],
    );

    // On récupère l'ID généré pour ce questionnaire
    const idGenere = resultQ.lastInsertRowId;

    // B. CALCUL DE LA RECOMMANDATION
    // Ton service retourne un objet contenant { idMiniJeu, ... }
    const reco = matchRecommandation(
      idEmotion,
      intensiteEmotion,
      idSignalCorporel,
    );

    // C. INSERTION DE LA RECOMMANDATION DANS SA TABLE
    await execSql(
      `INSERT INTO recommandation (id_questionnaire, cree_le, id_mini_jeu)
       VALUES (?, ?, ?)`,
      [idGenere, dateMaintenant, reco.idMiniJeu],
    );

    console.log("Questionnaire et Recommandation enregistrés !");
  } catch (error) {
    console.error("Erreur enregistrement complet :", error);
    throw error;
  }
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
    [idEnfant],
  );
}

export const getDernierQuestionnaireDuJour = async (idEnfant) => {
  try {
    const row = await queryAll(
      `
      SELECT 
        q.*, 
        e.libelle as emotion_nom, 
        s.libelle as corps_nom,
        r.id_mini_jeu as id_recommandation -- On récupère l'ID du jeu ici !
      FROM questionnaire_emotionnel q
      LEFT JOIN catalogue_emotions e ON q.id_emotion = e.id_emotion
      LEFT JOIN catalogue_signaux_corporels s ON q.id_signal_corporel = s.id_signal_corporel
      LEFT JOIN recommandation r ON q.id_questionnaire = r.id_questionnaire
      WHERE q.id_enfant = ? 
      ORDER BY q.date_questionnaire DESC 
      LIMIT 1
    `,
      [idEnfant],
    );

    return row[0] ?? null;
  } catch (error) {
    console.error("Erreur lecture dashboard :", error);
    return null;
  }
};
