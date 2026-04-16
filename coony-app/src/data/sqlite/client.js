import * as SQLite from 'expo-sqlite';
import { SCHEMA } from "../schema";

let db = null;

async function getDb() {
  if (!db) {
    db = await SQLite.openDatabaseAsync('coony-v5.db');
  }
  return db;
}

export const reinitialiserDonneesUtilisateur = async () => {
  try {
    await execute(`
      DELETE FROM questionnaire_emotionnel;
      DELETE FROM recommandation;
      -- Add any other tables that contain user progress here
      
      -- Optional: Reset the auto-increment counters
      DELETE FROM sqlite_sequence WHERE name='questionnaire_emotionnel';
      DELETE FROM sqlite_sequence WHERE name='recommandation';
    `);
    
    console.log("✅ Toutes les données utilisateur ont été effacées !");
  } catch (error) {
    console.error("❌ Erreur lors de la suppression des données :", error);
  }
};

async function execute(sql, params = []) {
  const db = await getDb();
  const stmt = await db.prepareAsync(sql);
  try {
    const result = await stmt.executeAsync(params);
    const rows = await result.getAllAsync();
    return rows;
  } finally {
    await stmt.finalizeAsync();
  }
}

export async function queryMany(sql, params = []) {
  return await execute(sql, params);
}

export async function queryOne(sql, params = []) {
  const rows = await execute(sql, params);
  return rows[0] ?? null;
}

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

export async function initialiserBaseDeDonnees() {
  const database = await getDb();
  await database.execAsync("PRAGMA foreign_keys = ON;");

  const statements = SCHEMA
    .replace(/--.*$/gm, "")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const stmt of statements) {
    await database.execAsync(stmt);
  }
}

export async function seedTable(table, selectSql, insertSql, rows) {
  const existing = await queryMany(selectSql);

  if (existing.length > 0) return;

  console.log(`Seed ${table}`);

  for (const row of rows) {
    await exec(insertSql, row);
  }
}