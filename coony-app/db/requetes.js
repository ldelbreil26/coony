import { queryAll } from "./baseDeDonnees";

export async function listerTables() {
  return queryAll(
    "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"
  );
}