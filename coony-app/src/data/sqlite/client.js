import * as SQLite from 'expo-sqlite';
import { SCHEMA } from "../schema";

let db = null;

async function getDb() {
  if (!db) {
    db = await SQLite.openDatabaseAsync('coony-v5.db');
  }
  return db;
}

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