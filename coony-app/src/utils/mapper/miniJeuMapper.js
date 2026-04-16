import { selectMiniJeu } from "../../data/sqlite/queries";

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

const FALLBACK_ID = 1; // Respiration
const ROUTE_TO_ID = Object.entries(MINI_JEUX_UI).reduce((acc, [id, config]) => {
  const slug = config.route.split("/").pop(); // ex: "detente"
  acc[slug] = Number(id);
  return acc;
}, {});

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

function buildJeu(id, minijeu) {
  const ui = MINI_JEUX_UI[id] || MINI_JEUX_UI[FALLBACK_ID];
  return {
    id,
    type: minijeu?.type_mj ?? null,
    titre: minijeu?.libelle ?? null,
    ...ui,
  };
}