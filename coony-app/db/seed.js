import { queryAll, execSql } from "./baseDeDonnees";

export async function seedCatalogues() {
  // EMOTIONS
  const emotions = await queryAll("SELECT * FROM catalogue_emotions");

  if (emotions.length === 0) {
    console.log("Seed émotions");

    const liste = [
      [1, "Joie"],
      [2, "Tristesse"],
      [3, "Calme"],
      [4, "Colère"],
      [5, "Aucun"],
      [6, "Angoisse"],
    ];

    for (const [id, libelle] of liste) {
      await execSql(
        "INSERT INTO catalogue_emotions (id_emotion, libelle) VALUES (?, ?)",
        [id, libelle],
      );
    }
  }

  // SIGNAUX CORPORELS
  const signaux = await queryAll("SELECT * FROM catalogue_signaux_corporels");

  if (signaux.length === 0) {
    console.log("Seed signaux corporels");

    const liste = [
      [1, "Coeur rapide"],
      [2, "Normal"],
      [3, "Ventre serré"],
      [4, "Corps tendu"],
      [5, "Fatigué"],
      [6, "Je ne sais pas"],
    ];

    for (const [id, libelle] of liste) {
      await execSql(
        "INSERT INTO catalogue_signaux_corporels (id_signal_corporel, libelle) VALUES (?, ?)",
        [id, libelle],
      );
    }
  }

  // LIEUX
  const lieux = await queryAll("SELECT * FROM catalogue_lieux");

  if (lieux.length === 0) {
    console.log("Seed lieux");

    const liste = [
      [1, "À la maison"],
      [2, "À l’école"],
      [3, "Dehors"],
      [4, "Dans la voiture"],
      [5, "Avec quelqu’un"],
      [6, "Je ne sais pas"],
    ];

    for (const [id, libelle] of liste) {
      await execSql(
        "INSERT INTO catalogue_lieux (id_lieu, libelle) VALUES (?, ?)",
        [id, libelle],
      );
    }
  }

  // MINI JEUX
  const miniJeux = await queryAll("SELECT * FROM catalogue_mini_jeux");

  if (miniJeux.length === 0) {
    console.log("Seed mini jeux");

    const liste = [
      [1, "respiration", "Respiration 4-4"],
      [2, "calme", "Pause calme"],
      [3, "reassurance", "Cocon sécurité"],
      [4, "apaisement", "Activité douce"],
      [5, "ancrage", "Exercice 5-4-3-2-1"],
      [6, "respiration", "Respiration lente"],
      [7, "positif", "Partage positif"],
      [8, "detente", "Moment détente"],
    ];

    for (const [id, type, libelle] of liste) {
      await execSql(
        "INSERT INTO catalogue_mini_jeux (id_mini_jeu, type_mj, libelle) VALUES (?, ?, ?)",
        [id, type, libelle],
      );
    }
  }

  console.log("Seed terminé");
}
