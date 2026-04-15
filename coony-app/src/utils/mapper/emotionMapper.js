export const EMOTIONS_DATA = {
  joie: {
    id: 1,
    label: "Joyeux",
    color: "#FFD700",
    iconName: "emoticon-outline",
  },
  tristesse: {
    id: 2,
    label: "Triste",
    color: "#42A5F5",
    iconName: "emoticon-sad",
  },
  calme: {
    id: 3,
    label: "Calme",
    color: "#66BB6A",
    iconName: "emoticon-happy",
  },
  colère: {
    id: 4,
    label: "Colère",
    color: "#EF5350",
    iconName: "emoticon-angry",
  },
  angoisse: {
    id: 6,
    label: "Angoissé",
    color: "#AB47BC",
    iconName: "emoticon-confused",
  },
  aucun: {
    id: 5,
    label: "Autre",
    color: "#90A4AE",
    iconName: "emoticon-neutral",
  },
};

function normalize(str) {
  return str
    ?.toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function getEmotionDetailsById(id) {
  return (
    EMOTIONS_DATA[id] || {
      label: "Inconnu",
      color: "#999999",
      iconName: "emoticon-outline",
    }
  );
}

export function getEmotionDetails(label) {
  if (!label) return null;

  const n = normalize(label);

  if (n.startsWith("trist")) return EMOTIONS_DATA[2];
  if (n.startsWith("joie") || n.startsWith("joy")) return EMOTIONS_DATA[1];
  if (n.startsWith("calme")) return EMOTIONS_DATA[3];
  if (n.startsWith("col")) return EMOTIONS_DATA[4];
  if (n.startsWith("angoiss")) return EMOTIONS_DATA[6];

  return {
    label,
    color: "#999999",
    iconName: "emoticon-outline",
  };
}
