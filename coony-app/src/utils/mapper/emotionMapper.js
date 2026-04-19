/**
 * @file emotionMapper.js
 * @description Fournit une couche de mappage propre entre les IDs/clés d'émotions de la base de données et la présentation UI.
 * Cet utilitaire garantit que l'application peut afficher de manière cohérente les émotions avec leurs
 * libellés, couleurs et icônes associés, quel que soit leur stockage dans la base de données.
 */

/**
 * Registre de toutes les émotions prises en charge et de leurs métadonnées UI.
 * Chaque entrée mappe un ID de base de données à ses propriétés de présentation.
 * 
 * @type {Object.<number, {id: number, key: string, label: string, color: string, iconName: string}>}
 */
export const EMOTIONS = {
  1: {
    id: 1,
    key: "joie",
    label: "Joyeux",
    color: "#FFD700",
    iconName: "emoticon-outline",
  },
  2: {
    id: 2,
    key: "triste",
    label: "Triste",
    color: "#42A5F5",
    iconName: "emoticon-sad",
  },
  3: {
    id: 3,
    key: "calme",
    label: "Calme",
    color: "#66BB6A",
    iconName: "emoticon-happy",
  },
  4: {
    id: 4,
    key: "colere",
    label: "Colère",
    color: "#EF5350",
    iconName: "emoticon-angry",
  },
  5: {
    id: 5,
    key: "autre",
    label: "Autre",
    color: "#90A4AE",
    iconName: "emoticon-neutral",
  },
  6: {
    id: 6,
    key: "angoisse",
    label: "Angoisse",
    color: "#AB47BC",
    iconName: "emoticon-confused",
  },
};

/**
 * Normalise une chaîne pour une correspondance robuste (minuscules, suppression des accents).
 * 
 * @param {string} str - La chaîne à normaliser.
 * @returns {string} La chaîne normalisée.
 */
const normalize = (str) =>
  str
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

/**
 * Recherche rapide par ID.
 * @type {typeof EMOTIONS}
 */
export const EMOTION_BY_ID = EMOTIONS;

/**
 * Recherche rapide par clé interne.
 * @type {Object.<string, typeof EMOTIONS[1]>}
 */
export const EMOTION_BY_KEY = Object.fromEntries(
  Object.values(EMOTIONS).map((e) => [e.key, e])
);

/**
 * Mappe les alias courants ou les termes localisés à leurs IDs de base de données canoniques.
 * Cela permet à l'UI de gérer diverses entrées tout en les faisant correspondre à un état cohérent.
 */
const EMOTION_ALIASES = {
  joie: 1,
  joyeux: 1,
  happy: 1,

  triste: 2,
  tristesse: 2,
  sad: 2,

  calme: 3,

  colere: 4,
  colère: 4,
  angry: 4,

  angoisse: 6,
  anxieux: 6,
};

/**
 * Résout les détails complets d'une émotion à partir de divers types d'entrées (clé, alias ou ID).
 * Si l'entrée ne peut pas être résolue, retourne un état "Inconnu" par défaut.
 * 
 * @param {string|number} input - L'identifiant à résoudre (ID, clé ou alias).
 * @returns {Object} Les métadonnées de l'émotion résolue.
 */
export function getEmotionDetails(input) {
  if (!input) {
    return {
      label: "Inconnu",
      color: "#999999",
      iconName: "emoticon-outline",
    };
  }

  const key = normalize(input);

  const id =
    EMOTION_ALIASES[key] ??
    EMOTION_BY_KEY[key]?.id;

  return EMOTION_BY_ID[id] ?? {
    label: input,
    color: "#999999",
    iconName: "emoticon-outline",
  };
}

/**
 * Mappage direct d'un ID de base de données vers sa représentation UI.
 * 
 * @param {number} idEmotion - L'ID de l'émotion dans la base de données.
 * @returns {Object} Les métadonnées de l'émotion pour le rendu UI.
 */
export function mapEmotion(idEmotion) {
  return (
    EMOTIONS[idEmotion] ?? {
      label: "Inconnu",
      color: "#999999",
      iconName: "emoticon-outline",
    }
  );
}
