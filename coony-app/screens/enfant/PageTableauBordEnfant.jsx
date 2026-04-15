import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useEnfantSelectionne } from "../../src/state/enfantSelectionne";
import { getDateDuJourFormatee } from "../../src/utils/date";

import COLORS from "../../src/utils/colors";
import FondOnde from "../../src/components/FondOnde";

import PageHeader from "../../src/components/common/PageHeader";
import Card from "../../src/components/common/Card";
import Pastille from "../../src/components/common/Pastille";
import EmotionSummary from "../../src/components/dashboard/EmotionSummary";
import ActivityCard from "../../src/components/dashboard/ActivityCard";
import Button from "../../src/components/common/Button";

import { useEnfantTableauDeBord } from "../../src/hooks/dashboard/useEnfantTableauDeBord";

export default function PageDashboardEnfant() {
  const { enfantSelectionne } = useEnfantSelectionne();
  const { 
    questionnaireDuJour, 
    emotionDetails, 
    activiteRecommandee 
  } = useEnfantTableauDeBord(enfantSelectionne);
  
  const dateDuJour = getDateDuJourFormatee();

  return (
    <View style={styles.mainWrapper}>
      <FondOnde />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <PageHeader 
          subtitle="Coucou,"
          title={enfantSelectionne?.prenom || "Ami"}
        />

        <Card style={styles.carteMood}>
          <View style={styles.headerCarte}>
            <Pastille 
              text="MON MOOD DU JOUR" 
              color="#FFF3E0" 
              textColor={COLORS.primary}
            />
            <Text style={styles.dateTexte}>{dateDuJour}</Text>
          </View>

          <View
            style={[
              styles.zoneCentrale,
              { borderTopColor: emotionDetails.color, borderTopWidth: 5 },
            ]}
          >
            {questionnaireDuJour ? (
              <EmotionSummary 
                emotion={questionnaireDuJour.emotion_nom}
                intensity={questionnaireDuJour.intensite_emotion}
                details={emotionDetails}
                bodyResponse={questionnaireDuJour.corps_nom}
              />
            ) : (
              <View style={styles.resultatVide}>
                <MaterialCommunityIcons
                  name="comment-question-outline"
                  size={60}
                  color={COLORS.textLight}
                />
                <Text style={styles.texteVide}>
                  Tu ne nous as pas encore dit comment tu te sens...
                </Text>
              </View>
            )}
          </View>

          <Button 
            title="QUESTIONNAIRE"
            onPress={() =>
              router.push(
                `/questionnaire/intro?prenom=${enfantSelectionne?.prenom}&idEnfant=${enfantSelectionne?.id_enfant}`,
              )
            }
            icon={() => <MaterialCommunityIcons name="star" size={22} color={COLORS.white} />}
            style={styles.boutonActionFort}
          />
        </Card>

        <View style={styles.sectionJeuSimplifiee}>
            <Text style={styles.sectionTitrePetit}>MINI-JEU DU JOUR</Text>
            
            <ActivityCard 
              title={activiteRecommandee ? activiteRecommandee.titre : "En attente du check-in"}
              label="MISSION DU JOUR :"
              icon={activiteRecommandee ? activiteRecommandee.icon : "lock"}
              color={activiteRecommandee ? activiteRecommandee.color : COLORS.textLight}
              onPress={() => activiteRecommandee && router.push(activiteRecommandee.route)}
              disabled={!activiteRecommandee}
            />
        </View>

        <Text style={styles.sectionTitrePetit}>AUTRES MINI-JEUX</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollActivites}
        >
          <TouchableOpacity
            style={styles.miniCarteActivite}
            onPress={() => router.push("/mini-jeu/respiration")}
          >
            <View style={[styles.miniIcon, { backgroundColor: "#E1F5FE" }]}>
              <MaterialCommunityIcons name="leaf" size={22} color="#03A9F4" />
            </View>
            <Text style={styles.miniLabel}>Respirer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.miniCarteActivite}>
            <View style={[styles.miniIcon, { backgroundColor: "#FFF3E0" }]}>
              <MaterialCommunityIcons name="brain" size={22} color="#FF9800" />
            </View>
            <Text style={styles.miniLabel}>Focus</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.miniCarteActivite}>
            <View style={[styles.miniIcon, { backgroundColor: "#F3E5F5" }]}>
              <MaterialCommunityIcons
                name="palette"
                size={22}
                color="#9C27B0"
              />
            </View>
            <Text style={styles.miniLabel}>Dessiner</Text>
          </TouchableOpacity>
        </ScrollView>

        <Button 
          title="Catalogue des émotions"
          onPress={() => router.push("/catalogue")}
          type="secondary"
          icon={() => <MaterialCommunityIcons name="book-open-page-variant" size={24} color={COLORS.white} />}
          style={styles.carteCatalogue}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1 },
  container: { padding: 24, paddingTop: 60, paddingBottom: 40 },

  carteMood: {
    marginBottom: 25,
  },
  headerCarte: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  dateTexte: { fontSize: 12, fontWeight: "700", color: COLORS.textLight },

  zoneCentrale: {
    backgroundColor: "#F8F9FA",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },

  resultatVide: { paddingVertical: 25, alignItems: "center" },
  texteVide: {
    marginTop: 12,
    color: COLORS.textLight,
    fontWeight: "600",
    textAlign: "center",
    fontSize: 15,
    lineHeight: 20,
  },

  boutonActionFort: {
    height: 60,
    borderRadius: 22,
    gap: 12,
  },

  sectionJeuSimplifiee: {
    marginBottom: 30,
  },

  sectionTitrePetit: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.textLight,
    letterSpacing: 1,
    marginBottom: 12,
    textTransform: "uppercase",
  },
  scrollActivites: { gap: 15, paddingRight: 20 },
  miniCarteActivite: {
    width: 110,
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 15,
    alignItems: "center",
    elevation: 3,
  },
  miniIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  miniLabel: { fontSize: 13, fontWeight: "800", color: COLORS.text },

  carteCatalogue: {
    height: 70,
    marginTop: 30,
  },
});
