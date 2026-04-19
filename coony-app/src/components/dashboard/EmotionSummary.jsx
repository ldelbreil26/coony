import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import COLORS from "../../utils/colors";
import { mapEmotion } from "../../utils/mapper/emotionMapper";

/**
 * Un composant qui affiche un résumé de l'émotion signalée par un enfant.
 * 
 * Il prend les données d'émotion brutes et les traduit en un résumé visuel,
 * comprenant une grande icône représentant l'émotion, son nom, l'intensité
 * du sentiment et l'endroit où elle est ressentie dans le corps.
 * 
 * @param {Object} props
 * @param {string} props.emotionId - L'ID de l'émotion à mapper et afficher.
 * @param {number} props.intensity - L'intensité signalée de l'émotion (généralement de 1 à 5).
 * @param {string} [props.bodyResponse] - Une description de la façon dont l'émotion est ressentie physiquement.
 */
const EmotionSummary = ({ emotionId, intensity, bodyResponse }) => {
  // Utilise l'aide mapEmotion pour récupérer les métadonnées d'affichage (iconName, color, label)
  const emotion = mapEmotion(emotionId);
  
  // Retourne null en toute sécurité si le mappage d'émotion est invalide ou manquant.
  if (!emotion) return null;

  return (
    <View style={styles.container}>
      {/* EN-TÊTE ÉMOTION : Affiche l'identité visuelle principale de l'émotion. */}
      <View style={styles.emotionHeader}>
        <MaterialCommunityIcons
          name={emotion.iconName}
          size={80}
          color={emotion.color}
        />

        <Text style={[styles.emotionTitre, { color: emotion.color }]}>
          {emotion.label}
        </Text>
      </View>

      {/* GRILLE DE STATS : Résume les points de données clés des résultats du questionnaire. */}
      <View style={styles.grilleInfos}>
        {/* INTENSITÉ : Visualise la force de l'émotion. */}
        <View style={styles.infoBulle}>
          <Text style={styles.infoLabel}>INTENSITÉ</Text>
          <Text style={[styles.infoValeur, { color: emotion.color }]}>
            {intensity}/5
          </Text>
        </View>

        <View style={styles.separateurV} />

        {/* RÉPONSE CORPORELLE : Indique la sensation physique associée à l'émotion. */}
        <View style={styles.infoBulle}>
          <Text style={styles.infoLabel}>DANS MON CORPS</Text>
          <Text style={styles.infoValeur}>
            {bodyResponse ?? "—"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
  },

  emotionHeader: {
    alignItems: "center",
    marginBottom: 10,
  },

  emotionTitre: {
    fontSize: 28,
    fontWeight: "900",
    marginTop: 8,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  grilleInfos: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    width: "100%",
  },

  infoBulle: {
    flex: 1,
    alignItems: "center",
  },

  infoLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: "800",
    textTransform: "uppercase",
  },

  infoValeur: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 4,
  },

  separateurV: {
    width: 1,
    height: 30,
    backgroundColor: "#E0E0E0",
  },
});

export default EmotionSummary;