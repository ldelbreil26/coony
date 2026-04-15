import * as SQLite from "expo-sqlite";
import { SCHEMA } from "../schema";

let db;

async function getDb() {
  if (db) return db;
  db = await SQLite.openDatabaseAsync("coony-v4.db");
  return db;
}

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
  await execute(sql, params);
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