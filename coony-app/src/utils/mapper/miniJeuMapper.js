// miniJeuMapper.js
import { selectMiniJeu } from "../../data/sqlite/queries";

const MINI_JEUX_UI = {
  1: { icon: "wind", color: "#4FC3F7", route: "/mini-jeu/1" },
  2: { icon: "leaf", color: "#81C784", route: "/mini-jeu/pause" },
  3: { icon: "shield-heart", color: "#BA68C8", route: "/mini-jeu/cocon" },
  4: { icon: "feather", color: "#FFD54F", route: "/mini-jeu/douceur" },
  5: { icon: "eye", color: "#FF8A65", route: "/mini-jeu/ancrage" },
  6: { icon: "weather-windy", color: "#4DB6AC", route: "/mini-jeu/respiration-lente" },
  7: { icon: "star", color: "#F06292", route: "/mini-jeu/partage" },
  8: { icon: "human-handsup", color: "#AED581", route: "/mini-jeu/detente" },
};

const FALLBACK_ID = 1; // Seul implémenté pour l'instant

export const fetchMiniJeu = async (id) => {
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