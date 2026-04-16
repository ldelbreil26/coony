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

const normalize = (str) =>
  str
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export const EMOTION_BY_ID = EMOTIONS;
export const EMOTION_BY_KEY = Object.fromEntries(
  Object.values(EMOTIONS).map((e) => [e.key, e])
);

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

export function mapEmotion(idEmotion) {
  return (
    EMOTIONS[idEmotion] ?? {
      label: "Inconnu",
      color: "#999999",
      iconName: "emoticon-outline",
    }
  );
}
