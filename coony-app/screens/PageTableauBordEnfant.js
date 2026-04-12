import { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEnfantSelectionne } from "../state/EnfantSelectionne";

import { getDateDuJourFormatee } from "../utils/UtilsDate";
import { listerQuestionnairesEnfant } from "../db/requetesMetier"; // <-- Ajout de l'import

export default function PageDashboardEnfant() {
  const { enfantSelectionne } = useEnfantSelectionne();
  const dateDuJour = getDateDuJourFormatee();

  // NOUVEAU : État pour stocker le questionnaire complété aujourd'hui
  const [questionnaireDuJour, setQuestionnaireDuJour] = useState(null);

  // NOUVEAU : Fonction pour vérifier si le check-in a été fait aujourd'hui
  const verifierQuestionnaireDuJour = async () => {
    if (!enfantSelectionne?.id_enfant) return;
    
    try {
      const historiques = await listerQuestionnairesEnfant(enfantSelectionne.id_enfant);
      // On cherche si un questionnaire correspond à la date d'aujourd'hui
      const trouve = historiques.find(q => q.date_questionnaire === dateDuJour);
      setQuestionnaireDuJour(trouve || null);
    } catch (error) {
      console.error("Erreur lors de la vérification du questionnaire :", error);
    }
  };

  // NOUVEAU : Se déclenche à chaque fois que l'écran est affiché
  useFocusEffect(
    useCallback(() => {
      verifierQuestionnaireDuJour();
    }, [enfantSelectionne, dateDuJour])
  );

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

        {/* AFFICHAGE CONDITIONNEL : Le cœur de l'étape 7 */}
        <View style={styles.zoneQuestionnaire}>
          {questionnaireDuJour ? (
            <View style={styles.resultatContainer}>
              <Text style={styles.texteResultat}>Émotion : {questionnaireDuJour.id_emotion}</Text>
              <Text style={styles.texteResultat}>Intensité : {questionnaireDuJour.intensite_emotion}/5</Text>
              <Text style={styles.texteBravo}>Super, ton check-in est fait ! 🎉</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.boutonQuestionnaire}
              onPress={allerQuestionnaire}
            >
              <Text style={styles.boutonQuestionnaireTexte}>QUESTIONNAIRE</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.ligneMiniJeu}>
          <Text style={styles.labelMiniJeu}>Mini jeu du jour :</Text>
          <View style={styles.champMiniJeu}>
             {/* Affichage du mini-jeu si le questionnaire est fait */}
             <Text style={styles.texteChampMiniJeu}>
               {questionnaireDuJour ? "RESPIRATION" : "À découvrir"}
             </Text>
          </View>
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

  resultatContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  texteResultat: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  texteBravo: {
    fontSize: 14,
    color: "#4CAF50", // Un petit vert rassurant
    marginTop: 10,
    fontWeight: "600",
  },
  texteChampMiniJeu: {
    color: "#333",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 6,
  }
});