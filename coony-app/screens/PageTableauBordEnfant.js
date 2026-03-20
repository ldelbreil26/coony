import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEnfantSelectionne } from "../state/EnfantSelectionne";

import { getDateDuJourFormatee } from "../utils/UtilsDate";
import { recupererIdEnfant } from "../db/requetesMetier";

export default function PageDashboardEnfant() {
  const { enfantSelectionne } = useEnfantSelectionne();
  const dateDuJour = getDateDuJourFormatee();

  const allerQuestionnaire = () => {
    router.push(`/questionnaire/intro?prenom=${enfantSelectionne?.prenom}&idEnfant=${enfantSelectionne.id_enfant}`);
  };

  const retournerMenu = () => {
    router.push("/menu");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.bonjour}>
          Bonjour {enfantSelectionne?.prenom || "XXXX"}
        </Text>

        <TouchableOpacity style={styles.boutonSortie} onPress={retournerMenu}>
          <Ionicons name="exit-outline" size={26} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.carteMood}>
        <View style={styles.headerCarte}>
          <View style={styles.pastille}>
            <Text style={styles.pastilleTexte}>MOOD DU JOUR</Text>
          </View>

          <Text style={styles.dateTexte}>{dateDuJour}</Text>
        </View>

        <View style={styles.zoneQuestionnaire}>
          <TouchableOpacity
            style={styles.boutonQuestionnaire}
            onPress={allerQuestionnaire}
          >
            <Text style={styles.boutonQuestionnaireTexte}>QUESTIONNAIRE</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.ligneMiniJeu}>
          <Text style={styles.labelMiniJeu}>Mini jeu du jour :</Text>
          <View style={styles.champMiniJeu} />
        </View>
      </View>

      <View style={styles.carteMiniJeux}>
        <View style={styles.grilleMiniJeux}>
          <TouchableOpacity style={styles.boutonMiniJeu}>
            <Text style={styles.texteMiniJeu}>RESPIRATION</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.boutonMiniJeu}>
            <Text style={styles.texteMiniJeu}>CONCENTRATION</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.boutonMiniJeu}>
            <Text style={styles.texteMiniJeu}>DESSIN</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.boutonMiniJeu}>
            <Text style={styles.texteMiniJeu}>5 - 4 - 3 - 2 - 1</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.carteCatalogue}>
        <TouchableOpacity style={styles.boutonCatalogue}>
          <Text style={styles.texteCatalogue}>CATALOGUE DES ÉMOTIONS</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F4F4F4",
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  bonjour: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  boutonSortie: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EDE7E7",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  carteMood: {
    backgroundColor: "#D9D9D9",
    borderRadius: 22,
    padding: 18,
    marginBottom: 28,

    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  headerCarte: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },
  pastille: {
    backgroundColor: "#F3F3F3",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  pastilleTexte: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  dateTexte: {
    color: "#F5F5F5",
    fontSize: 16,
    fontWeight: "600",
  },
  zoneQuestionnaire: {
    backgroundColor: "#F4F4F4",
    borderRadius: 20,
    minHeight: 170,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  boutonQuestionnaire: {
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    paddingHorizontal: 38,
    paddingVertical: 18,

    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  boutonQuestionnaireTexte: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  ligneMiniJeu: {
    flexDirection: "row",
    alignItems: "center",
  },
  labelMiniJeu: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginRight: 10,
  },
  champMiniJeu: {
    flex: 1,
    height: 32,
    backgroundColor: "#F3F3F3",
    borderRadius: 16,
  },
  carteMiniJeux: {
    backgroundColor: "#D9D9D9",
    borderRadius: 22,
    padding: 18,
    marginBottom: 28,

    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  grilleMiniJeux: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 14,
  },
  boutonMiniJeu: {
    width: "47%",
    backgroundColor: "#F3F3F3",
    borderRadius: 20,
    minHeight: 74,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  texteMiniJeu: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },
  carteCatalogue: {
    backgroundColor: "#F4F4F4",
    borderRadius: 22,
    padding: 12,

    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  boutonCatalogue: {
    backgroundColor: "#D9D9D9",
    borderRadius: 22,
    minHeight: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  texteCatalogue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },
});