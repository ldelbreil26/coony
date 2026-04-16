export const EMOTIONS = {
  1: {
    id: 1,
    label: "Joyeux",
    color: "#FFD700",
    iconName: "emoticon-outline",
  },
  2: {
    id: 2,
    label: "Triste",
    color: "#42A5F5",
    iconName: "emoticon-sad",
  },
  3: {
    id: 3,
    label: "Calme",
    color: "#66BB6A",
    iconName: "emoticon-happy",
  },
  4: {
    id: 4,
    label: "Colère",
    color: "#EF5350",
    iconName: "emoticon-angry",
  },
  5: {
    id: 5,
    label: "Autre",
    color: "#90A4AE",
    iconName: "emoticon-neutral",
  },
  6: {
    id: 6,
    label: "Angoissé",
    color: "#AB47BC",
    iconName: "emoticon-confused",
  },
};

export function getEmotionDetails(nomEmotion) {
  const emotion = Object.values(EMOTIONS).find(
    (e) => e.label.toLowerCase() === nomEmotion?.toLowerCase()
  );

  return (
    emotion ?? {
      label: nomEmotion || "Inconnu",
      color: "#999999",
      iconName: "emoticon-outline",
    }
  );
}

export function mapEmotion(idEmotion) {
  return (
    EMOTIONS[idEmotion] ?? {
      label: "Inconnu",
      color: "#999999",
      iconName: "emoticon-outline",
    }
  );
}
