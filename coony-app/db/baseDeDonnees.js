import * as SQLite from "expo-sqlite";
import { SCHEMA_SQL } from "./schema";

let db = null;

async function ouvrirDb() {
  if (!db) {
    db = await SQLite.openDatabaseAsync("coony_v2.db");
  }
  return db;
}

export async function execSql(sql, params = []) {
  const database = await ouvrirDb();

  const statement = await database.prepareAsync(sql);

  try {
    const result = await statement.executeAsync(params);
    return result;
  } finally {
    await statement.finalizeAsync();
  }
}

export async function queryAll(sql, params = []) {
  const database = await ouvrirDb();

  const statement = await database.prepareAsync(sql);

  try {
    const result = await statement.executeAsync(params);
    return await result.getAllAsync();
  } finally {
    await statement.finalizeAsync();
  }
}

export async function initialiserBaseDeDonnees() {
  const database = await ouvrirDb();

  await database.execAsync("PRAGMA foreign_keys = ON;");

  const sansCommentaires = SCHEMA_SQL.replace(/--.*$/gm, "");

  const statements = sansCommentaires
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const stmt of statements) {
    await database.execAsync(stmt + ";");
  }
}