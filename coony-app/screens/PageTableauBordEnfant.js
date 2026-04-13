import { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEnfantSelectionne } from "../state/EnfantSelectionne";

import { getDateDuJourFormatee } from "../utils/UtilsDate";
import { getQuestionnaireDuJour } from "../db/requetesMetier";

export default function PageDashboardEnfant() {
  const { enfantSelectionne } = useEnfantSelectionne();
  const dateDuJour = getDateDuJourFormatee();

  const [questionnaireDuJour, setQuestionnaireDuJour] = useState(null);

  const verifierQuestionnaireDuJour = async () => {
    if (!enfantSelectionne?.id_enfant) return;
    
    try {
      const trouve = await getQuestionnaireDuJour(enfantSelectionne?.id_enfant);
      setQuestionnaireDuJour(trouve);
    } catch (error) {
      console.error("Erreur lors de la vérification du questionnaire :", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      verifierQuestionnaireDuJour();
    }, [enfantSelectionne])
  );

  const allerQuestionnaire = () => {
    router.push(`/questionnaire/intro?prenom=${enfantSelectionne?.prenom}&idEnfant=${enfantSelectionne.id_enfant}`);
  };

  const allerAuJeu = (idJeu) => {
    router.push(`/mini-jeu/${idJeu}`);
  };

  const retournerMenu = () => {
    router.push("/menu");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.bonjour}>
          Bonjour {enfantSelectionne?.prenom || "XXXX"}
        </Text>
        <TouchableOpacity style={styles.boutonSortie} onPress={retournerMenu}>
          <Ionicons name="exit-outline" size={26} color="#333" />
        </TouchableOpacity>
      </View>

      {/* CARTE MOOD DU JOUR */}
      <View style={styles.carteMood}>
        <View style={styles.headerCarte}>
          <View style={styles.pastille}>
            <Text style={styles.pastilleTexte}>MOOD DU JOUR</Text>
          </View>
          <Text style={styles.dateTexte}>{dateDuJour}</Text>
        </View>

        {/* ZONE RESULTATS : Vide si pas de questionnaire, remplie sinon */}
        <View style={styles.zoneQuestionnaire}>
          {questionnaireDuJour && (
            <View style={styles.resultatContainer}>
              <Text style={styles.texteResultat}>Émotion : {questionnaireDuJour.id_emotion}</Text>
              <Text style={styles.texteResultat}>Intensité : {questionnaireDuJour.intensite_emotion}/5</Text>
            </View>
          )}
        </View>

        {/* LIGNE FIXE : BOUTON QUESTIONNAIRE */}
        <View style={styles.ligneQuestionnaire}>
          <TouchableOpacity 
            style={styles.champQuestionnaire} 
            onPress={allerQuestionnaire}
          >
            <Text style={styles.texteQuestionnaire}>QUESTIONNAIRE</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* GRILLE DES MINI-JEUX COMPLÈTE */}
      <View style={styles.carteMiniJeux}>
        <View style={styles.grilleMiniJeux}>
          <TouchableOpacity 
            style={styles.boutonMiniJeu} 
            onPress={() => allerAuJeu(1)}
          >
            <Ionicons name="leaf-outline" size={24} color="#333" />
            <Text style={styles.texteMiniJeu}>RESPIRATION 4-4</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.boutonMiniJeu}>
            <Ionicons name="bulb-outline" size={24} color="#333" />
            <Text style={styles.texteMiniJeu}>CONCENTRATION</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.boutonMiniJeu}>
            <Ionicons name="brush-outline" size={24} color="#333" />
            <Text style={styles.texteMiniJeu}>DESSIN</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.boutonMiniJeu}>
            <Ionicons name="hand-right-outline" size={24} color="#333" />
            <Text style={styles.texteMiniJeu}>5 - 4 - 3 - 2 - 1</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CATALOGUE */}
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
    elevation: 3,
  },
  carteMood: {
    backgroundColor: "#D9D9D9",
    borderRadius: 22,
    padding: 18,
    marginBottom: 28,
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
  ligneQuestionnaire: {
    flexDirection: "row",
    alignItems: "center",
  },
  labelQuestionnaire: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginRight: 10,
  },
  champQuestionnaire: {
    flex: 1,
    height: 42,
    backgroundColor: "#F3F3F3", // Même couleur claire que tes boutons
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  texteQuestionnaire: {
    color: "#333",
    fontSize: 14,
    fontWeight: "700",
  },
  carteMiniJeux: {
    backgroundColor: "#D9D9D9",
    borderRadius: 22,
    padding: 18,
    marginBottom: 28,
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
    minHeight: 85,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    elevation: 3,
  },
  texteMiniJeu: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },
  carteCatalogue: {
    backgroundColor: "#F4F4F4",
    borderRadius: 22,
    padding: 12,
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  texteBravo: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "600",
  }
});