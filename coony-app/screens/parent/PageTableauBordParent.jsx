import { View, Text, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { useSessionParent } from "../../src/state/sessionParent";
import { getEmotionDetails } from "../../src/utils/mapper/emotionMapper";

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getDateDuJourFormatee } from "../../src/utils/date";

import COLORS from "../../src/utils/colors";
import FondOnde from "../../src/components/FondOnde";

import PageHeader from "../../src/components/common/PageHeader";
import Card from "../../src/components/common/Card";
import Pastille from "../../src/components/common/Pastille";
import ChildSelector from "../../src/components/parent/ChildSelector";
import HistoryItem from "../../src/components/parent/HistoryItem";
import Button from "../../src/components/common/Button";

import { useParentTableauDeBord } from "../../src/hooks/dashboard/useParentTableauDeBord";

export default function PageTableauBordParent() {
  const { parentConnecte } = useSessionParent();
  const { 
    enfants, 
    enfantSelectionne, 
    questionnaires, 
    changerEnfant 
  } = useParentTableauDeBord(parentConnecte);

  const dateDuJour = getDateDuJourFormatee();

  const dernierQuestionnaire = questionnaires.length > 0 ? questionnaires[0] : null;
  const emotionDetails = getEmotionDetails(dernierQuestionnaire?.emotion_nom) || {
    color: "#CCCCCC",
    iconName: "help-circle-outline",
    label: "Inconnu"
  };

  return (
    <View style={styles.mainWrapper}>
      <FondOnde />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <PageHeader 
          subtitle="Bonjour,"
          title={parentConnecte?.email ? parentConnecte.email.split("@")[0] : "Parent"}
          showAccount
        />

        <ChildSelector 
          children={enfants}
          selectedChildId={enfantSelectionne?.id_enfant}
          onSelectChild={changerEnfant}
          onAddChild={() => router.push("/ajout_enfant")}
        />

        <Card style={styles.cartePrincipale}>
          <View style={styles.headerCarte}>
            <Pastille text="MOOD DU JOUR" />
            <Text style={styles.enfantLabel}>{enfantSelectionne?.prenom || "---"}</Text>
          </View>

          <View style={[styles.grandBlocEmotion, { borderTopWidth: 5, borderTopColor: emotionDetails.color }]}>
            {dernierQuestionnaire ? (
              <View style={styles.emotionInfos}>
                <View style={styles.emotionHeader}>
                   <MaterialCommunityIcons 
                    name={emotionDetails.iconName} 
                    size={60} 
                    color={emotionDetails.color} 
                   />
                   <Text style={[styles.emotionTitre, { color: emotionDetails.color }]}>
                    {dernierQuestionnaire.emotion_nom}
                   </Text>
                </View>
                
                <View style={styles.statsLigne}>
                   <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Intensité</Text>
                      <Text style={[styles.statValeur, { color: emotionDetails.color }]}>
                        {dernierQuestionnaire.intensite_emotion}/5
                      </Text>
                   </View>
                   <View style={styles.dividerVertical} />
                   <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Lieu</Text>
                      <Text style={[styles.statValeur, { color:"#5D4037" }]}>{dernierQuestionnaire.lieu_nom || "---"}</Text>
                   </View>
                </View>
              </View>
            ) : (
              <Text style={styles.infoVide}>Pas encore de réponse aujourd'hui.</Text>
            )}
          </View>

          <View style={styles.ligneActivite}>
            <View style={styles.iconActivite}>
               <MaterialCommunityIcons name="auto-fix" size={20} color={COLORS.secondary} />
            </View>
            <View>
              <Text style={styles.labelActivite}>Activité suggérée :</Text>
              <Text style={styles.valeurActivite}>
                {dernierQuestionnaire ? "Respiration 4-4" : "En attente du check-in"}
              </Text>
            </View>
          </View>

          <View style={styles.footerCarte}>
            <Text style={styles.dateTexte}>{dateDuJour}</Text>
            <Button 
              title="CONSEILS"
              onPress={() => {}}
              style={styles.boutonConseils}
              textStyle={styles.boutonConseilsTexte}
            />
          </View>
        </Card>

        <View style={styles.sectionHeader}>
           <Text style={styles.titreSection}>Historique récent</Text>
           <MaterialCommunityIcons name="history" size={20} color={COLORS.textLight} />
        </View>

        <Card style={styles.carteHistorique}>
          {questionnaires.length > 0 ? (
            questionnaires.slice(0, 5).map((q, index) => (
              <HistoryItem 
                key={index}
                emotion={q.emotion_nom}
                intensity={q.intensite_emotion}
                date={q.date_questionnaire}
                details={getEmotionDetails(q.emotion_nom)}
                isLast={index === questionnaires.slice(0, 5).length - 1}
              />
            ))
          ) : (
            <Text style={styles.infoVide}>Aucun historique enregistré.</Text>
          )}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1 },
  container: { padding: 24, paddingTop: 60, paddingBottom: 40, flexGrow: 1, backgroundColor: 'transparent' },

  cartePrincipale: { padding: 20, marginBottom: 25 },
  headerCarte: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  enfantLabel: { fontSize: 16, fontWeight: "800", color: COLORS.secondary },

  grandBlocEmotion: { backgroundColor: COLORS.background, borderRadius: 20, padding: 20, marginBottom: 20, alignItems: "center" },
  emotionHeader: { alignItems: "center", marginBottom: 15 },
  emotionTitre: { fontSize: 22, fontWeight: "900", marginTop: 5, letterSpacing: 1 },
  
  statsLigne: { flexDirection: "row", alignItems: "center", justifyContent: "center", width: "100%", borderTopWidth: 1, borderTopColor: COLORS.accent, paddingTop: 15 },
  statItem: { alignItems: "center", flex: 1 },
  statLabel: { fontSize: 12, color: COLORS.textLight, fontWeight: "600" },
  statValeur: { fontSize: 16, fontWeight: "800" },
  dividerVertical: { width: 1, height: 25, backgroundColor: COLORS.accent },

  ligneActivite: { flexDirection: "row", alignItems: "center", marginBottom: 25, backgroundColor: COLORS.background, padding: 12, borderRadius: 15 },
  iconActivite: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.white, justifyContent: "center", alignItems: "center", marginRight: 12 },
  labelActivite: { fontSize: 12, color: COLORS.textLight, fontWeight: "600" },
  valeurActivite: { fontSize: 15, fontWeight: "700", color: COLORS.text },

  footerCarte: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: COLORS.accent, paddingTop: 15 },
  dateTexte: { fontSize: 12, color: COLORS.textLight, fontWeight: "500" },
  boutonConseils: { 
    backgroundColor: COLORS.textLight, 
    borderRadius: 12, 
    paddingHorizontal: 18, 
    paddingVertical: 8,
    elevation: 0,
  },
  boutonConseilsTexte: { fontSize: 12, fontWeight: "800", color: COLORS.white },

  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  titreSection: { fontSize: 18, fontWeight: "800", color: COLORS.text },
  carteHistorique: { padding: 15, marginBottom: 30 },
  infoVide: { fontSize: 14, color: COLORS.textLight, fontStyle: "italic", textAlign: "center", paddingVertical: 10 },
});
