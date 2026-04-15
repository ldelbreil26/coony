import { getMiniJeux } from "../db/requetesMetier";

const MINI_JEUX_UI = {
  1: { icon: "wind", color: "#4FC3F7", route: "/jeu/respiration" },
  2: { icon: "leaf", color: "#81C784", route: "/jeu/pause" },
  3: { icon: "shield-heart", color: "#BA68C8", route: "/jeu/cocon" },
  4: { icon: "feather", color: "#FFD54F", route: "/jeu/douceur" },
  5: { icon: "eye", color: "#FF8A65", route: "/jeu/ancrage" },
  6: {
    icon: "weather-windy",
    color: "#4DB6AC",
    route: "/jeu/respiration-lente",
  },
  7: { icon: "star", color: "#F06292", route: "/jeu/partage" },
  8: { icon: "human-handsup", color: "#AED581", route: "/jeu/detente" },
};

export const getMiniJeuById = async (id) => {
  const minijeu = await getMiniJeux(id);

  const fallbackId = 1;
  const fallbackUI = MINI_JEUX_UI[fallbackId];

  if (!minijeu) {
    return {
      id: fallbackId,
      type: null,
      libelle: null,
      ...fallbackUI,
    };
  }

  const ui = MINI_JEUX_UI[minijeu.id] || fallbackUI;

  return {
    id: minijeu.id,
    type: minijeu.type ?? null,
    libelle: minijeu.libelle ?? null,
    ...ui,
  };
};
