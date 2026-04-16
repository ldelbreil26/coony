export function nowSqlite() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function getDateDuJourFormatee() {
  const aujourdHui = new Date();

  const jour = String(aujourdHui.getDate()).padStart(2, "0");
  const mois = String(aujourdHui.getMonth() + 1).padStart(2, "0");
  const annee = aujourdHui.getFullYear();

  return `${jour} / ${mois} / ${annee}`;
}