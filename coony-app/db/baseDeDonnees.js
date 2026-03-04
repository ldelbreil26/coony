import * as SQLite from "expo-sqlite";
import { SCHEMA_SQL } from "./schema";

let db = null;

async function ouvrirDb() {
  if (!db) {
    db = await SQLite.openDatabaseAsync("coony.db");
  }
  return db;
}

export async function execSql(sql, params = []) {
  const database = await ouvrirDb();
  return database.runAsync(sql, params);
}

export async function queryAll(sql, params = []) {
  const database = await ouvrirDb();
  return database.getAllAsync(sql, params);
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