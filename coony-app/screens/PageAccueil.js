import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import COLORS from "../utils/Colors"; 
import FondOnde from "../components/FondOnde"; 

export default function Accueil() {
  return (
    <View style={{ flex: 1 }}>
      <FondOnde />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.carte}>
          <Text style={styles.titre}>Bienvenue sur COONY</Text>

          <Text style={styles.texte}>
            COONY est une application pensée pour aider les enfants à mieux
            reconnaître et exprimer leurs émotions, grâce à des outils visuels
            simples et des activités adaptées.
          </Text>

          <Text style={styles.texte}>
            Chaque jour, l’enfant peut partager comment il se sent à l’aide
            d’images, de couleurs et de petits repères faciles à comprendre.
          </Text>

          <Text style={styles.texte}>
            En fonction de ses réponses, l’application propose une activité douce
            pour l’aider à se sentir mieux.
          </Text>

          <View style={styles.divider} />

          <Text style={styles.texteWarning}>
            COONY est un outil d’accompagnement et de dialogue entre l’enfant et
            son parent. Il ne remplace pas un professionnel de santé.
          </Text>

          <View style={styles.divider} />

          <Text style={styles.texteLeger}>
            En continuant, vous confirmez être le responsable légal de l’enfant
            et accepter d’utiliser l’application dans ce cadre.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.boutonPrincipal}
          onPress={() => router.push("/inscription")}
        >
          <Text style={styles.boutonPrincipalTexte}>Créer un compte</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.boutonSecondaire}
          onPress={() => router.push("/connexion")}
        >
          <Text style={styles.boutonSecondaireTexte}>Connexion</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 100,
    paddingBottom: 50,
    alignItems: "center",
  },
  carte: {
    width: "100%",
    backgroundColor: COLORS.card,
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 34,
    marginBottom: 40,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
  },
  titre: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 24,
  },
  texte: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.text,
    textAlign: "center",
    fontWeight: "500",
    marginBottom: 18,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.accent,
    marginVertical: 15,
    width: "50%",
    alignSelf: "center",
  },
  texteWarning: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.textLight,
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 10,
  },
  texteLeger: {
    fontSize: 11,
    color: COLORS.textLight,
    textAlign: "center",
  },
  boutonPrincipal: {
    backgroundColor: COLORS.primary,
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 28,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
    elevation: 3,
  },
  boutonPrincipalTexte: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.white,
  },
  boutonSecondaire: {
    backgroundColor: "transparent",
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 28,
    width: "100%",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  boutonSecondaireTexte: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
});