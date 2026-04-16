import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useEnfantSelectionne } from "../../src/state/enfantSelectionne";
import { getDateDuJourFormatee } from "../../src/utils/date";

import COLORS from "../../src/utils/colors";
import FondOnde from "../../src/components/FondOnde";

import { useEnfantTableauDeBord } from "../../src/hooks/dashboard/useEnfantTableauDeBord";

export default function PageDashboardEnfant() {
  const { enfantSelectionne } = useEnfantSelectionne();
  const { 
    questionnaireDuJour, 
    emotionDetails, 
    activiteRecommandee 
  } = useEnfantTableauDeBord(enfantSelectionne);

  const reco = activiteRecommandee;
  const dateDuJour = getDateDuJourFormatee();

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
            <Text style={styles.boutonActionTexte}>QUESTIONNAIRE</Text>
            <MaterialCommunityIcons
              name="star"
              size={22}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionJeuSimplifiee}>
            <Text style={styles.sectionTitrePetit}>MINI-JEU DU JOUR</Text>
            
            <TouchableOpacity 
                style={[
                    styles.ligneActiviteEnfant, 
                    !reco && styles.ligneDesactivee
                ]}
                onPress={() => reco && router.push(reco.route)}
                disabled={!reco}
            >
                <View style={[
                    styles.iconActiviteCercle, 
                    { backgroundColor: reco ? reco.color : COLORS.texte }
                ]}>
                    <MaterialCommunityIcons 
                        name={reco ? reco.icon : "lock"} 
                        size={24} 
                        color={COLORS.texte} 
                    />
                </View>
                
                <View style={styles.contenuTexteActivite}>
                    <Text style={styles.labelActivitePetit}>MISSION DU JOUR :</Text>
                    <Text style={[
                        styles.valeurActiviteGrande,
                        { color: reco ? COLORS.text : COLORS.textLight }
                    ]}>
                        {reco ? reco.titre : "En attente du check-in"}
                    </Text>
                </View>

                {reco && (
                    <View style={[styles.badgeJouer, { backgroundColor: reco.color }]}>
                        <MaterialCommunityIcons name="play" size={16} color={COLORS.white} />
                    </View>
                )}
            </TouchableOpacity>
        </View>

        {/* --- AUTRES MINI-JEUX --- */}
        <Text style={styles.sectionTitrePetit}>AUTRES MINI-JEUX</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentCpontainerStyle={styles.scrollActivites}
        >
          <TouchableOpacity
            style={styles.miniCarteActivite}
            onPress={() => router.push("/mini-jeu/1")}
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
  mainWrapper: { flex: 1 },
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

  sectionJeuSimplifiee: {
    marginBottom: 30,
  },
  ligneActiviteEnfant: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  ligneDesactivee: {
    opacity: 0.7,
    backgroundColor: '#F5F5F5',
    elevation: 0,
  },
  iconActiviteCercle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contenuTexteActivite: {
    flex: 1,
    marginLeft: 15,
  },
  labelActivitePetit: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.textLight,
    letterSpacing: 0.5,
  },
  valeurActiviteGrande: {
    fontSize: 18,
    fontWeight: "900",
    marginTop: 2,
  },
  badgeJouer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
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