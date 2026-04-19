/**
 * @file miniJeuMapper.js
 * @description Gère le mappage entre les enregistrements de mini-jeux de la base de données et la configuration spécifique à l'UI.
 * Il combine les données de la base de données SQLite (libellés, types) avec les ressources frontend (icônes, couleurs, routes)
 * pour fournir un objet unifié pour la couche UI.
 */

import { selectMiniJeu } from "../../data/sqlite/queries";

/**
 * Configuration spécifique à l'UI pour chaque ID de mini-jeu.
 * Définit l'identité visuelle et le chemin de navigation pour le jeu.
 * 
 * @type {Object.<number, {icon: string, color: string, route: string}>}
 */
export const MINI_JEUX_UI = {
  1: { icon: "weather-windy", color: "#4FC3F7", route: "/mini-jeu/respiration" },
  2: { icon: "leaf", color: "#81C784", route: "/mini-jeu/pause" },
  3: { icon: "heart-plus", color: "#BA68C8", route: "/mini-jeu/cocon" },
  4: { icon: "feather", color: "#FFD54F", route: "/mini-jeu/douceur" },
  5: { icon: "eye", color: "#FF8A65", route: "/mini-jeu/ancrage" },
  6: { icon: "weather-windy", color: "#4DB6AC", route: "/mini-jeu/respiration-lente" },
  7: { icon: "star", color: "#F06292", route: "/mini-jeu/partage" },
  8: { icon: "human-handsup", color: "#AED581", route: "/mini-jeu/detente" },
};

/**
 * ID de mini-jeu par défaut utilisé comme solution de secours.
 */
const FALLBACK_ID = 1; // Respiration

/**
 * Mappage inverse des slugs de route (ex : "detente") vers les IDs de base de données.
 * Utilisé pour le routage dynamique où seul le slug est disponible dans l'URL.
 */
const ROUTE_TO_ID = Object.entries(MINI_JEUX_UI).reduce((acc, [id, config]) => {
  const slug = config.route.split("/").pop(); // ex : "detente"
  acc[slug] = Number(id);
  return acc;
}, {});

/**
 * Récupère les données du mini-jeu depuis la base de données et les fusionne avec la configuration UI.
 * Prend en charge les recherches par ID de base de données (nombre) ou par slug de route (chaîne).
 * 
 * @param {number|string} input - L'ID de base de données ou le slug de route.
 * @returns {Promise<Object>} Un objet unifié contenant les métadonnées de la base de données et de l'UI.
 */
export const fetchMiniJeu = async (input) => {
  if (!input) return buildJeu(FALLBACK_ID, null);

  let id = input;
  if (typeof input === "string") {
    id = ROUTE_TO_ID[input];
  }

  if (!id) return buildJeu(FALLBACK_ID, null);

  const minijeu = await selectMiniJeu(id);
  if (!minijeu) return buildJeu(FALLBACK_ID, null);

  return buildJeu(minijeu.id_mini_jeu, minijeu);
};

/**
 * Construit l'objet mini-jeu final en fusionnant l'enregistrement de la base de données et la config UI.
 * 
 * @param {number} id - L'ID du mini-jeu.
 * @param {Object|null} minijeu - L'enregistrement de la base de données (si disponible).
 * @returns {Object} L'objet mini-jeu complet pour l'utilisation dans l'UI.
 */
function buildJeu(id, minijeu) {
  const ui = MINI_JEUX_UI[id] || MINI_JEUX_UI[FALLBACK_ID];
  return {
    id,
    type: minijeu?.type_mj ?? null,
    titre: minijeu?.libelle ?? null,
    ...ui,
  };
}
