/**
 * @module SQLiteClient
 * @description Couche d'accès bas niveau à la base de données SQLite.
 * Ce module encapsule l'utilisation de 'expo-sqlite' et fournit des méthodes simplifiées
 * pour l'exécution des requêtes SQL.
 */

import * as SQLite from 'expo-sqlite';
import { SCHEMA } from "../schema";

/**
 * Instance de la base de données (Singleton).
 * @type {SQLite.SQLiteDatabase|null}
 */
let db = null;

/**
 * Récupère ou initialise la connexion à la base de données.
 * Utilise le pattern Singleton pour éviter d'ouvrir plusieurs connexions.
 * @returns {Promise<SQLite.SQLiteDatabase>}
 */
async function getDb() {
  if (!db) {
    db = await SQLite.openDatabaseAsync('coony-v5.db');
  }
  return db;
}

/**
 * Réinitialise complètement la base de données.
 * Supprime toutes les tables et les recrée à partir du schéma.
 * Utile pour le développement et les tests.
 */
export const reinitialiserBaseDeDonnees = async () => {
  const database = await getDb();
  
  await database.execAsync(`
    PRAGMA foreign_keys = OFF;
    DROP TABLE IF EXISTS session_minijeu;
    DROP TABLE IF EXISTS recommandation;
    DROP TABLE IF EXISTS questionnaire_emotionnel;
    DROP TABLE IF EXISTS profil_enfant;
    DROP TABLE IF EXISTS compte_parent;
    DROP TABLE IF EXISTS catalogue_mini_jeux;
    DROP TABLE IF EXISTS catalogue_lieux;
    DROP TABLE IF EXISTS catalogue_signaux_corporels;
    DROP TABLE IF EXISTS catalogue_emotions;
    PRAGMA foreign_keys = ON;
  `);

  await initialiserBaseDeDonnees();
  
  console.log("Base réinitialisée !");
};

/**
 * Fonction générique interne pour préparer et exécuter une requête SQL.
 * Gère automatiquement la finalisation du statement pour éviter les fuites mémoire.
 * 
 * @param {string} sql - La requête SQL avec des placeholders (?).
 * @param {any[]} params - Les paramètres de la requête.
 * @returns {Promise<any[]>} Les lignes résultantes de la requête.
 */
async function execute(sql, params = []) {
  const db = await getDb();
  const stmt = await db.prepareAsync(sql);
  try {
    const result = await stmt.executeAsync(params);
    const rows = await result.getAllAsync();
    return rows;
  } finally {
    // Crucial : toujours finaliser le statement
    await stmt.finalizeAsync();
  }
}

/**
 * Exécute une requête de lecture et retourne plusieurs résultats.
 * @param {string} sql 
 * @param {any[]} params 
 * @returns {Promise<any[]>}
 */
export async function queryMany(sql, params = []) {
  return await execute(sql, params);
}

/**
 * Exécute une requête de lecture et retourne un seul résultat.
 * @param {string} sql 
 * @param {any[]} params 
 * @returns {Promise<any|null>} Le premier résultat ou null.
 */
export async function queryOne(sql, params = []) {
  const rows = await execute(sql, params);
  return rows[0] ?? null;
}

/**
 * Exécute une requête de modification (INSERT, UPDATE, DELETE).
 * @param {string} sql 
 * @param {any[]} params 
 * @returns {Promise<number|null>} L'ID de la dernière ligne insérée.
 */
export async function exec(sql, params = []) {
  const db = await getDb();
  const stmt = await db.prepareAsync(sql);
  try {
    const result = await stmt.executeAsync(params);
    return result.lastInsertRowId ?? null;
  } finally {
    await stmt.finalizeAsync();
  }
}

/**
 * Initialise la structure de la base de données.
 * Parse le fichier schema.sql et exécute chaque commande individuellement.
 */
export async function initialiserBaseDeDonnees() {
  const database = await getDb();
  await database.execAsync("PRAGMA foreign_keys = ON;");

  // Nettoyage du schéma (retrait des commentaires) et séparation des instructions
  const statements = SCHEMA
    .replace(/--.*$/gm, "")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const stmt of statements) {
    await database.execAsync(stmt);
  }
}

/**
 * Remplit une table avec des données initiales si elle est vide.
 * 
 * @param {string} table - Nom de la table.
 * @param {string} selectSql - Requête pour vérifier si des données existent.
 * @param {string} insertSql - Requête d'insertion.
 * @param {any[][]} rows - Données à insérer.
 */
export async function seedTable(table, selectSql, insertSql, rows) {
  const existing = await queryMany(selectSql);

  if (existing.length > 0) return;

  console.log(`Seed ${table}`);

  for (const row of rows) {
    await exec(insertSql, row);
  }
}