import { View, Text, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQuestionnaire } from "../state/QuestionnaireState";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import COLORS from "../utils/Colors";
import FondOnde from "../components/FondOnde";

export default function IntroQuestionnaire() {
  const { idEnfant, prenom } = useLocalSearchParams();
  const { mettreAJourQuestionnaire } = useQuestionnaire();

  const commencerQuestionnaire = () => {
    mettreAJourQuestionnaire({
      idEnfant: Number(idEnfant),
      prenom: prenom,
    });
    router.push("/questionnaire/emotion");
  };

  return (
    <View style={styles.container}>
      <FondOnde />
      
      {/* BOUTON ANNULER (CROIX) */}
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity 
          style={styles.boutonFermer} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="close" size={28} color={COLORS.textLight} />
        </TouchableOpacity>
      </SafeAreaView>

      <View style={styles.content}>
        {/* ICONE D'ACCUEIL */}
        <View style={styles.illustration}>
            <MaterialCommunityIcons name="comment-quote" size={80} color={COLORS.primary} />
        </View>

        <Text style={styles.titre}>
          Coucou {prenom} !
        </Text>

        <View style={styles.bulleInfo}>
            <Text style={styles.texte}>
              On va prendre un petit moment pour comprendre comment tu te sens.
            </Text>
            <Text style={styles.texte}>
              C'est facile : il n'y a pas de bonne ou de mauvaise réponse.
            </Text>
        </View>

        <TouchableOpacity
          style={styles.bouton}
          onPress={commencerQuestionnaire}
          activeOpacity={0.8}
        >
          <Text style={styles.texteBouton}>C'est parti !</Text>
          <MaterialCommunityIcons name="arrow-right" size={28} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    zIndex: 10,
  },
  boutonFermer: {
    position: "absolute",
    top: 60, // Ajusté pour ne pas être trop collé au bord
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  illustration: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  titre: {
    fontSize: 32,
    fontWeight: "900",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 20,
  },
  bulleInfo: {
    backgroundColor: COLORS.white,
    borderRadius: 30,
    padding: 25,
    marginBottom: 25,
    elevation: 3,
    width: '100%',
  },
  texte: {
    fontSize: 17,
    color: COLORS.text,
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 10,
    fontWeight: "500",
  },
  bouton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    borderRadius: 25,
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    width: '100%',
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
  },
  texteBouton: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.white,
  }
});