import { queryAll, execSql } from "./baseDeDonnees";

export async function seedCatalogues() {

  // EMOTIONS
  const emotions = await queryAll("SELECT * FROM catalogue_emotions");

  if (emotions.length === 0) {

    console.log("Seed émotions");

    const liste = [
      "Joie",
      "Tristesse",
      "Colère",
      "Peur",
      "Angoisse"
    ];

    for (const libelle of liste) {
      await execSql(
        "INSERT INTO catalogue_emotions (libelle) VALUES (?)",
        [libelle]
      );
    }
  }

  // SIGNAUX CORPORELS
  const signaux = await queryAll(
    "SELECT * FROM catalogue_signaux_corporels"
  );

  if (signaux.length === 0) {

    console.log("Seed signaux corporels");

    const liste = [
      "Coeur qui bat vite",
      "Ventre serré",
      "Normal",
      "Fatigue",
      "Corps détendu"
    ];

    for (const libelle of liste) {
      await execSql(
        "INSERT INTO catalogue_signaux_corporels (libelle) VALUES (?)",
        [libelle]
      );
    }
  }

  // LIEUX
  const lieux = await queryAll("SELECT * FROM catalogue_lieux");

  if (lieux.length === 0) {

    console.log("Seed lieux");

    const liste = [
      "Maison",
      "École",
      "Extérieur",
      "Voiture",
      "Avec quelqu'un",
      "Autre"
    ];

    for (const libelle of liste) {
      await execSql(
        "INSERT INTO catalogue_lieux (libelle) VALUES (?)",
        [libelle]
      );
    }
  }

  // COULEURS
  const couleurs = await queryAll(
    "SELECT * FROM catalogue_couleurs"
  );

  if (couleurs.length === 0) {

    console.log("Seed couleurs");

    const liste = [
      ["Rouge", "#EF4444"],
      ["Orange", "#F97316"],
      ["Jaune", "#FACC15"],
      ["Vert", "#22C55E"],
      ["Bleu", "#3B82F6"],
      ["Violet", "#8B5CF6"]
    ];

    for (const [nom, hex] of liste) {
      await execSql(
        "INSERT INTO catalogue_couleurs (nom, valeur_hex) VALUES (?, ?)",
        [nom, hex]
      );
    }
  }

  // MINI JEUX
  const miniJeux = await queryAll(
    "SELECT * FROM catalogue_mini_jeux"
  );

  if (miniJeux.length === 0) {

    console.log("Seed mini jeux");

    const liste = [
      ["respiration", "Respiration guidée"],
      ["observation", "Jeu d'observation"],
    ];

    for (const [type, libelle] of liste) {
      await execSql(
        "INSERT INTO catalogue_mini_jeux (type_mj, libelle) VALUES (?, ?)",
        [type, libelle]
      );
    }
  }

  console.log("Seed terminé");

}