import { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// État et Logique
import { useEnfantSelectionne } from "../state/EnfantSelectionne";
import { getDateDuJourFormatee } from "../utils/UtilsDate";
import { getDernierQuestionnaireDuJour } from "../db/requetesMetier";

// Mappers
import { getEmotionDetails } from "../utils/EmotionMapper";
import { getMiniJeuById } from "../utils/MiniJeuMapper"; // Ton mapper basé sur l'ID du jeu

// Design System
import COLORS from "../utils/Colors";
import FondOnde from "../components/FondOnde";

export default function PageDashboardEnfant() {
  const { enfantSelectionne } = useEnfantSelectionne();
  const dateDuJour = getDateDuJourFormatee();
  const [questionnaireDuJour, setQuestionnaireDuJour] = useState(null);

  // Vérification et récupération du questionnaire + recommandation
  const verifierQuestionnaireDuJour = async () => {
    if (!enfantSelectionne?.id_enfant) return;
    try {
      // Cette fonction fait maintenant le LEFT JOIN avec la table recommandation
      const trouve = await getDernierQuestionnaireDuJour(
        enfantSelectionne.id_enfant,
      );
      setQuestionnaireDuJour(trouve);
    } catch (error) {
      console.error("Erreur lors de la récupération :", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      verifierQuestionnaireDuJour();
    }, [enfantSelectionne]),
  );

  // 1. On récupère les détails visuels de l'émotion (Couleur, Icône)
  const emotionDetails = getEmotionDetails(
    questionnaireDuJour?.emotion_nom,
  ) || {
    color: "#D9D9D9",
    iconName: "emoticon-happy-outline",
    label: "Inconnu",
  };

  // 2. On récupère l'activité recommandée via l'ID récupéré en jointure
  const activiteRecommandee = questionnaireDuJour?.id_recommandation
    ? getMiniJeuById(questionnaireDuJour.id_recommandation)
    : null;

  return (
    <View style={styles.mainWrapper}>
      <FondOnde />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.salutation}>Coucou,</Text>
            <Text style={styles.prenom}>
              {enfantSelectionne?.prenom || "Ami"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.boutonHome}
            onPress={() => router.push("/menu")}
          >
            <MaterialCommunityIcons
              name="home-variant"
              size={26}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>

        {/* --- CARTE MOOD DU JOUR --- */}
        <View style={styles.carteMood}>
          <View style={styles.headerCarte}>
            <View style={styles.pastille}>
              <Text style={styles.pastilleTexte}>MON MOOD DU JOUR</Text>
            </View>
            <Text style={styles.dateTexte}>{dateDuJour}</Text>
          </View>

          <View
            style={[
              styles.zoneCentrale,
              { borderTopColor: emotionDetails.color, borderTopWidth: 5 },
            ]}
          >
            {questionnaireDuJour ? (
              <View style={styles.resultatContainer}>
                <MaterialCommunityIcons
                  name={emotionDetails.iconName}
                  size={80}
                  color={emotionDetails.color}
                />
                <Text
                  style={[styles.emotionTitre, { color: emotionDetails.color }]}
                >
                  {questionnaireDuJour.emotion_nom}
                </Text>

                <View style={styles.grilleInfos}>
                  <View style={styles.infoBulle}>
                    <Text style={styles.infoLabel}>INTENSITÉ</Text>
                    <Text
                      style={[
                        styles.infoValeur,
                        { color: emotionDetails.color },
                      ]}
                    >
                      {questionnaireDuJour.intensite_emotion}/5
                    </Text>
                  </View>
                  <View style={styles.separateurV} />
                  <View style={styles.infoBulle}>
                    <Text style={styles.infoLabel}>DANS MON CORPS</Text>
                    <Text style={styles.infoValeur}>
                      {questionnaireDuJour.corps_nom || "Tranquille"}
                    </Text>
                  </View>
                </View>
              </View>
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

          <TouchableOpacity
            style={styles.boutonActionFort}
            onPress={() =>
              router.push(
                `/questionnaire/intro?prenom=${enfantSelectionne?.prenom}&idEnfant=${enfantSelectionne?.id_enfant}`,
              )
            }
          >
            <MaterialCommunityIcons
              name="star"
              size={22}
              color={COLORS.white}
            />
            <Text style={styles.boutonActionTexte}>FAIRE MON BILAN</Text>
            <MaterialCommunityIcons
              name="star"
              size={22}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>

        {activiteRecommandee ? (
          <View style={styles.sectionSuggerer}>
            <View style={styles.titreLigne}>
              <Text style={styles.sectionTitrePetit}>TON MINI-JEU DU JOUR</Text>
              <View style={styles.badgeSpecial}>
                <Text style={styles.badgeTexte}>DÉBLOQUÉ</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.carteJeuDuJour,
                { backgroundColor: activiteRecommandee.color },
              ]}
              onPress={() => router.push(activiteRecommandee.route)}
              activeOpacity={0.9}
            >
              <View style={styles.jeuContenu}>
                <View style={styles.jeuTextes}>
                  <Text style={styles.jeuSlogan}>Prêt pour ta mission ?</Text>
                  <Text style={styles.jeuNom}>{activiteRecommandee.titre}</Text>

                  <View style={styles.boutonJouerInterne}>
                    <Text
                      style={[
                        styles.boutonJouerTexte,
                        { color: activiteRecommandee.color },
                      ]}
                    >
                      JOUER MAINTENANT
                    </Text>
                    <MaterialCommunityIcons
                      name="play"
                      size={18}
                      color={activiteRecommandee.color}
                    />
                  </View>
                </View>
                <View style={styles.jeuIconeFond}>
                  <MaterialCommunityIcons
                    name={activiteRecommandee.icon}
                    size={80}
                    color="rgba(255,255,255,0.25)"
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          /* Si pas de questionnaire, on montre que c'est verrouillé */
          <View style={styles.rappelQuestionnaire}>
            <MaterialCommunityIcons
              name="lock-outline"
              size={24}
              color={COLORS.textLight}
            />
            <Text style={styles.rappelTexte}>
              Fais ton bilan pour débloquer ton jeu spécial !
            </Text>
          </View>
        )}

        {/* --- AUTRES ACTIVITÉS --- */}
        <Text style={styles.sectionTitrePetit}>AUTRES ACTIVITÉS</Text>
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

        <TouchableOpacity
          style={styles.carteCatalogue}
          onPress={() => router.push("/catalogue")}
        >
          <MaterialCommunityIcons
            name="book-open-page-variant"
            size={24}
            color={COLORS.white}
          />
          <Text style={styles.texteCatalogue}>Catalogue des émotions</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 24, paddingTop: 60, paddingBottom: 40 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  salutation: { fontSize: 16, fontWeight: "600", color: COLORS.textLight },
  prenom: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.primary,
    marginTop: -5,
  },
  boutonHome: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },

  carteMood: {
    backgroundColor: COLORS.card,
    borderRadius: 32,
    padding: 20,
    marginBottom: 25,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  headerCarte: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  pastille: {
    backgroundColor: "#FFF3E0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  pastilleTexte: { fontWeight: "900", fontSize: 11, color: COLORS.primary },
  dateTexte: { fontSize: 12, fontWeight: "700", color: COLORS.textLight },

  zoneCentrale: {
    backgroundColor: "#F8F9FA",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  resultatContainer: { alignItems: "center", width: "100%" },
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
  infoBulle: { flex: 1, alignItems: "center" },
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
  separateurV: { width: 1, height: 30, backgroundColor: "#E0E0E0" },

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
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    elevation: 4,
  },
  boutonActionTexte: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.white,
    letterSpacing: 1,
  },

  // Styles Activité suggérée
  sectionSuggerer: { marginBottom: 30 },
  titreLigne: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 15,
  },
  badgeSpecial: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeTexte: { color: COLORS.white, fontSize: 10, fontWeight: "900" },
  carteJeuDuJour: {
    borderRadius: 30,
    padding: 25,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  jeuContenu: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  jeuTextes: { flex: 1, zIndex: 2 },
  jeuSlogan: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  jeuNom: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 18,
  },
  boutonJouerInterne: {
    backgroundColor: COLORS.white,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 8,
  },
  boutonJouerTexte: { fontWeight: "900", fontSize: 13 },
  jeuIconeFond: { position: "absolute", right: -20, bottom: -20, zIndex: 1 },

  rappelQuestionnaire: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "rgba(0,0,0,0.03)",
    padding: 20,
    borderRadius: 25,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "#D1D1D1",
    marginBottom: 30,
  },
  rappelTexte: {
    color: COLORS.textLight,
    fontSize: 14,
    fontWeight: "600",
    flexShrink: 1,
  },

  sectionTitrePetit: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.textLight,
    letterSpacing: 1,
    marginBottom: 15,
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
    backgroundColor: COLORS.secondary,
    borderRadius: 22,
    height: 70,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginTop: 30,
    elevation: 2,
  },
  texteCatalogue: { color: COLORS.white, fontSize: 16, fontWeight: "800" },
});
