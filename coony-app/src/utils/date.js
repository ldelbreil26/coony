export function nowSqlite() {
  return new Date().toISOString().slice(0, 19).replace("T", " ");
}

export function getDateDuJourFormatee() {
  const aujourdHui = new Date();

  const jour = String(aujourdHui.getDate()).padStart(2, "0");
  const mois = String(aujourdHui.getMonth() + 1).padStart(2, "0");
  const annee = aujourdHui.getFullYear();

  return `${jour} / ${mois} / ${annee}`;
}