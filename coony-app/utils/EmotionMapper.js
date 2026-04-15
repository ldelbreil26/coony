// utils/EmotionMapper.js

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

export const getEmotionDetails = (emotionNom) => {
  if (!emotionNom) return null;
  const nomNettoye = emotionNom.toLowerCase().trim();

  // Gestion des alias (colere sans accent, etc.)
  if (nomNettoye === "colere") return EMOTIONS_DATA["colère"];
  if (nomNettoye === "angoissé" || nomNettoye === "angoissée")
    return EMOTIONS_DATA["angoisse"];

  return (
    EMOTIONS_DATA[nomNettoye] || {
      label: emotionNom,
      color: "#999999",
      iconName: "emoticon-outline",
    }
  );
};
