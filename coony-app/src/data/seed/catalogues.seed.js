import { seedTable } from "../sqlite/client";

// -------------------- CATALOGUES SEED --------------------
// On remplit la base de données avec toutes les informations utilisées dans les questionnaires :
// - Emotions
// - Signaux Corporels
// - Lieux
// - Mini Jeux

export async function seedCatalogues() {
  await seedTable(
    "catalogue_emotions",
    "SELECT * FROM catalogue_emotions",
    "INSERT INTO catalogue_emotions (id_emotion, libelle) VALUES (?, ?)",
    [
      [1, "Joie"],
      [2, "Tristesse"],
      [3, "Calme"],
      [4, "Colère"],
      [5, "Aucun"],
      [6, "Angoisse"],
    ]
  );

  await seedTable(
    "catalogue_signaux_corporels",
    "SELECT * FROM catalogue_signaux_corporels",
    "INSERT INTO catalogue_signaux_corporels (id_signal_corporel, libelle) VALUES (?, ?)",
    [
      [1, "Coeur rapide"],
      [2, "Normal"],
      [3, "Ventre serré"],
      [4, "Corps tendu"],
      [5, "Fatigué"],
      [6, "Je ne sais pas"],
    ]
  );

  await seedTable(
    "catalogue_lieux",
    "SELECT * FROM catalogue_lieux",
    "INSERT INTO catalogue_lieux (id_lieu, libelle) VALUES (?, ?)",
    [
      [1, "À la maison"],
      [2, "À l’école"],
      [3, "Dehors"],
      [4, "Dans la voiture"],
      [5, "Avec quelqu’un"],
      [6, "Je ne sais pas"],
    ]
  );

  await seedTable(
    "catalogue_mini_jeux",
    "SELECT * FROM catalogue_mini_jeux",
    "INSERT INTO catalogue_mini_jeux (id_mini_jeu, type_mj, libelle) VALUES (?, ?, ?)",
    [
      [1, "respiration", "Respiration 4-4"],
      [2, "calme", "Pause calme"],
      [3, "reassurance", "Cocon sécurité"],
      [4, "apaisement", "Activité douce"],
      [5, "ancrage", "Exercice 5-4-3-2-1"],
      [6, "respiration", "Respiration lente"],
      [7, "positif", "Partage positif"],
      [8, "detente", "Moment détente"],
    ]
  );

  console.log("Catalogues seed terminé");
}