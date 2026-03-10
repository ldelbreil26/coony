import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";

export default function Accueil() {
  return (
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

        <Text style={styles.texte}>
          COONY est un outil d’accompagnement et de dialogue entre l’enfant et
          son parent.{"\n"}
          Il ne remplace pas un professionnel de santé.
        </Text>

        <Text style={styles.texte}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F4F4F4",
    paddingHorizontal: 28,
    paddingTop: 110,
    paddingBottom: 40,
    alignItems: "center",
  },
  carte: {
    width: "100%",
    backgroundColor: "#D9D9D9",
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 34,
    marginBottom: 48,
  },
  titre: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 34,
  },
  texte: {
    fontSize: 15,
    lineHeight: 32,
    color: "#333",
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 22,
  },
  boutonPrincipal: {
    backgroundColor: "#D9D9D9",
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 28,
    minWidth: 250,
    alignItems: "center",
    marginBottom: 28,
  },
  boutonPrincipalTexte: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  boutonSecondaire: {
    backgroundColor: "#EDE7E7",
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 28,
    minWidth: 190,
    alignItems: "center",
  },
  boutonSecondaireTexte: {
    fontSize: 17,
    fontWeight: "700",
    color: "#333",
  },
});