import { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEnfantSelectionne } from "../state/EnfantSelectionne";

import { getDateDuJourFormatee } from "../utils/UtilsDate";
import { getDernierQuestionnaireDuJour } from "../db/requetesMetier";

export default function PageDashboardEnfant() {
  const { enfantSelectionne } = useEnfantSelectionne();
  const dateDuJour = getDateDuJourFormatee();

  const [questionnaireDuJour, setQuestionnaireDuJour] = useState(null);

  // Fonction pour charger le dernier questionnaire du jour
  const verifierQuestionnaireDuJour = async () => {
    if (!enfantSelectionne?.id_enfant) return;
    
    try {
      // On utilise bien la fonction importée avec le JOIN SQL
      const trouve = await getDernierQuestionnaireDuJour(enfantSelectionne.id_enfant);
      setQuestionnaireDuJour(trouve);
    } catch (error) {
      console.error("Erreur lors de la vérification du questionnaire :", error);
    }
  };

  // Rafraîchissement automatique quand on arrive sur la page
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
          Bonjour {enfantSelectionne?.prenom || "Ami"}
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

        {/* ZONE RESULTATS */}
        <View style={styles.zoneQuestionnaire}>
          {questionnaireDuJour ? (
            <View style={styles.resultatContainer}>
              <Text style={styles.texteResultat}>
                Émotion : <Text style={styles.valeurResultat}>{questionnaireDuJour.emotion_nom}</Text>
              </Text>
              <Text style={styles.texteResultat}>
                Intensité : <Text style={styles.valeurResultat}>{questionnaireDuJour.intensite_emotion}/5</Text>
              </Text>
            </View>
          ) : (
            <View style={styles.resultatVide}>
              <Ionicons name="happy-outline" size={40} color="#888" />
              <Text style={styles.texteVide}>Comment te sens-tu aujourd'hui ?</Text>
            </View>
          )}
        </View>

        {/* BOUTON QUESTIONNAIRE */}
        <View style={styles.ligneQuestionnaire}>
          <TouchableOpacity 
            style={styles.champQuestionnaire} 
            onPress={allerQuestionnaire}
          >
            <Text style={styles.texteQuestionnaire}>
              {"QUESTIONNAIRE"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* GRILLE DES MINI-JEUX */}
      <View style={styles.carteMiniJeux}>
        <View style={styles.grilleMiniJeux}>
          <TouchableOpacity 
            style={styles.boutonMiniJeu} 
            onPress={() => allerAuJeu("respiration")}
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
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
  },
  zoneQuestionnaire: {
    backgroundColor: "#F4F4F4",
    borderRadius: 20,
    minHeight: 140,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    padding: 15,
  },
  resultatContainer: {
    alignItems: "center",
  },
  resultatVide: {
    alignItems: "center",
    gap: 10,
  },
  texteVide: {
    color: "#888",
    fontSize: 14,
    fontStyle: "italic",
  },
  texteResultat: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  valeurResultat: {
    fontWeight: "bold",
    color: "#333",
  },
  texteBravo: {
    fontSize: 13,
    color: "#4CAF50",
    marginTop: 8,
    fontWeight: "600",
  },
  champQuestionnaire: {
    backgroundColor: "#F3F3F3",
    borderRadius: 16,
    height: 45,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CCC",
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
  },
  grilleMiniJeux: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  boutonMiniJeu: {
    width: "48%",
    backgroundColor: "#F3F3F3",
    borderRadius: 20,
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
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
  },
  boutonCatalogue: {
    backgroundColor: "#D9D9D9",
    borderRadius: 22,
    minHeight: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  texteCatalogue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
});