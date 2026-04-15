import { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useSessionParent } from "../state/SessionParent";
import { listerEnfantsDuParent, listerQuestionnairesEnfant } from "../db/requetesMetier";

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getDateDuJourFormatee } from "../utils/UtilsDate";
import { getEmotionDetails } from "../utils/EmotionMapper";

import COLORS from "../utils/Colors";
import FondOnde from "../components/FondOnde";

export default function PageTableauBordParent() {
  const { parentConnecte } = useSessionParent();
  const [enfants, setEnfants] = useState([]);
  const [enfantSelectionne, setEnfantSelectionne] = useState(null);
  const [questionnaires, setQuestionnaires] = useState([]);

  const dateDuJour = getDateDuJourFormatee();

  const chargerListeEnfants = async () => {
    try {
      if (!parentConnecte?.id_parent) return;
      const liste = await listerEnfantsDuParent(parentConnecte.id_parent);
      setEnfants(liste);

      if (liste.length > 0 && !enfantSelectionne) {
        setEnfantSelectionne(liste[0]);
        chargerHistorique(liste[0].id_enfant);
      } else if (enfantSelectionne) {
        chargerHistorique(enfantSelectionne.id_enfant);
      }
    } catch (error) {
      console.error("Erreur chargement enfants :", error);
    }
  };

  const chargerHistorique = async (idEnfant) => {
    try {
      const listeQuestionnaires = await listerQuestionnairesEnfant(idEnfant);
      setQuestionnaires(listeQuestionnaires);
    } catch (error) {
      console.error("Erreur chargement historique :", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      chargerListeEnfants();
    }, [parentConnecte])
  );

  const changerEnfant = (enfant) => {
    setEnfantSelectionne(enfant);
    chargerHistorique(enfant.id_enfant);
  };

  const dernierQuestionnaire = questionnaires.length > 0 ? questionnaires[0] : null;
  const emotionDetails = getEmotionDetails(dernierQuestionnaire?.emotion_nom) || {
    color: "#CCCCCC", // Gris par défaut si non trouvé
    iconName: "help-circle-outline",
    label: "Inconnu"
  };
  return (
    <View style={styles.mainWrapper}>
      <FondOnde />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* HEADER : Bonjour & Boutons Navigation */}
        <View style={styles.header}>
          <View>
            <Text style={styles.bonjourLabel}>Bonjour,</Text>
            <Text style={styles.bonjourNom}>
              {parentConnecte?.email ? parentConnecte.email.split("@")[0] : "Parent"}
            </Text>
          </View>
          
          <View style={styles.headerActions}>
            {/* Bouton Menu (Maison) */}
            <TouchableOpacity style={styles.boutonRondHeader} onPress={() => router.push("/menu")}>
              <MaterialCommunityIcons name="home" size={26} color={COLORS.primary} />
            </TouchableOpacity>

            {/* Bouton Profil */}
            <TouchableOpacity style={styles.boutonRondHeader} onPress={() => router.push("/compte_parent")}>
              <MaterialCommunityIcons name="account" size={28} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* SELECTEUR D'ENFANT */}
        <View style={styles.selecteurContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
            {enfants.map((e) => (
              <TouchableOpacity 
                key={e.id_enfant} 
                style={[styles.ongletEnfant, enfantSelectionne?.id_enfant === e.id_enfant && styles.ongletActif]}
                onPress={() => changerEnfant(e)}
              >
                <Text style={[styles.ongletTexte, enfantSelectionne?.id_enfant === e.id_enfant && styles.ongletTexteActif]}>
                  {e.prenom}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.ongletAjout} onPress={() => router.push("/ajout_enfant")}>
               <MaterialCommunityIcons name="plus" size={20} color={COLORS.text} />
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* CARTE INFOS DU JOUR */}
        <View style={styles.cartePrincipale}>
          <View style={styles.headerCarte}>
            <View style={styles.pastille}>
              <Text style={styles.pastilleTexte}>MOOD DU JOUR</Text>
            </View>
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
            <TouchableOpacity style={styles.boutonConseils}>
              <Text style={styles.boutonConseilsTexte}>CONSEILS</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* HISTORIQUE */}
        <View style={styles.sectionHeader}>
           <Text style={styles.titreSection}>Historique récent</Text>
           <MaterialCommunityIcons name="history" size={20} color={COLORS.textLight} />
        </View>

        <View style={styles.carteHistorique}>
          {questionnaires.length > 0 ? (
            questionnaires.slice(0, 5).map((q, index) => {
              const histMood = getEmotionDetails(q.emotion_nom);
              return (
                <View key={index} style={[styles.ligneHistorique, index === 4 && { borderBottomWidth: 0 }]}>
                  <View style={[styles.historiqueDateBox, { backgroundColor: histMood.color + '20' }]}>
                     <Text style={[styles.histDate, { color: histMood.color }]}>
                        {q.date_questionnaire.split('-')[2].split(' ')[0]}
                     </Text>
                     <Text style={styles.histMois}>avr.</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                     <Text style={styles.histEmotion}>{q.emotion_nom}</Text>
                     <Text style={styles.histSub}>Intensité : {q.intensite_emotion}/5</Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.accent} />
                </View>
              );
            })
          ) : (
            <Text style={styles.infoVide}>Aucun historique enregistré.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1 },
  container: { padding: 24, paddingTop: 60, paddingBottom: 40, flexGrow: 1, backgroundColor: 'transparent' },
  
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 25 
  },
  headerActions: { 
    flexDirection: "row", 
    gap: 12 
  },
  boutonRondHeader: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    backgroundColor: COLORS.card, 
    justifyContent: "center", 
    alignItems: "center", 
    elevation: 4, 
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }
  },
  
  bonjourLabel: { fontSize: 16, color: COLORS.textLight, fontWeight: "500" },
  bonjourNom: { fontSize: 24, fontWeight: "900", color: COLORS.primary, marginTop: -4 },
  
  selecteurContainer: { marginBottom: 25 },
  ongletEnfant: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: COLORS.card, marginRight: 10, borderWidth: 1, borderColor: COLORS.accent },
  ongletActif: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  ongletTexte: { fontSize: 14, fontWeight: "700", color: COLORS.text },
  ongletTexteActif: { color: COLORS.white },
  ongletAjout: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.accent, justifyContent: "center", alignItems: "center" },

  cartePrincipale: { backgroundColor: COLORS.card, borderRadius: 30, padding: 20, marginBottom: 25, elevation: 6, shadowColor: COLORS.shadow, shadowOpacity: 0.1, shadowRadius: 10 },
  headerCarte: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  pastille: { backgroundColor: COLORS.background, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 },
  pastilleTexte: { fontWeight: "800", fontSize: 11, color: COLORS.text, letterSpacing: 0.5 },
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
  boutonConseils: { backgroundColor: COLORS.textLight, borderRadius: 12, paddingHorizontal: 18, paddingVertical: 8 },
  boutonConseilsTexte: { fontSize: 12, fontWeight: "800", color: COLORS.white },

  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  titreSection: { fontSize: 18, fontWeight: "800", color: COLORS.text },
  carteHistorique: { backgroundColor: COLORS.card, borderRadius: 25, padding: 15, marginBottom: 30, elevation: 4 },
  ligneHistorique: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.background },
  historiqueDateBox: { width: 45, height: 45, borderRadius: 12, justifyContent: "center", alignItems: "center", marginRight: 15 },
  histDate: { fontSize: 16, fontWeight: "900" },
  histMois: { fontSize: 10, fontWeight: "700", color: COLORS.textLight, textTransform: "uppercase" },
  histEmotion: { fontSize: 15, fontWeight: "700", color: COLORS.text },
  histSub: { fontSize: 12, color: COLORS.textLight },
  infoVide: { fontSize: 14, color: COLORS.textLight, fontStyle: "italic", textAlign: "center" },
});