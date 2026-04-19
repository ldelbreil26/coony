/**
 * Retourne la date et l'heure actuelles formatées pour SQLite.
 *
 * @returns {string} La date au format "YYYY-MM-DD HH:MM:SS".
 *
 * @example
 * const timestamp = nowSqlite(); // "2025-04-19 14:30:00"
 */
export function nowSqlite() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/**
 * Retourne la date du jour formatée pour l'affichage.
 *
 * @returns {string} La date au format "JJ / MM / AAAA".
 *
 * @example
 * const date = getDateDuJourFormatee(); // "19 / 04 / 2025"
 */
export function getDateDuJourFormatee() {
  const aujourdHui = new Date();

  const jour = String(aujourdHui.getDate()).padStart(2, "0");
  const mois = String(aujourdHui.getMonth() + 1).padStart(2, "0");
  const annee = aujourdHui.getFullYear();

  return `${jour} / ${mois} / ${annee}`;
}