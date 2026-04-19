import { View, Text, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { useSessionParent } from "../../src/state/sessionParent";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import COLORS from "../../src/utils/colors";
import FondOnde from "../../src/components/FondOnde";

import { useParentTableauDeBord } from "../../src/hooks/dashboard/useParentTableauDeBord";

import ChildSelector from "../../src/components/parent/ChildSelector";
import HistoryItem from "../../src/components/parent/HistoryItem";
import Pastille from "../../src/components/common/Pastille";
import Card from "../../src/components/common/Card";
import Button from "../../src/components/common/Button";
import PageHeader from "../../src/components/common/PageHeader";

/**
 * Écran du Tableau de bord Parent.
 * 
 * Ce composant sert de hub principal pour les parents. Il leur permet de :
 * - Basculer entre les profils de plusieurs enfants.
 * - Consulter le dernier état émotionnel (humeur) de l'enfant sélectionné.
 * - Voir les activités recommandées basées sur l'émotion actuelle de l'enfant.
 * - Accéder à un journal historique des questionnaires précédents.
 * 
 * Il s'appuie sur le hook `useParentTableauDeBord` pour la récupération des données et la gestion de l'état
 * relatif aux enfants du parent et à leurs réponses.
 */
export default function PageTableauBordParent() {
  const { parentConnecte } = useSessionParent();
  
  // Hook personnalisé gérant la logique complexe de récupération des enfants,
  // d'identification de l'enfant sélectionné et de récupération de ses derniers questionnaires.
  const { 
    enfants, 
    enfantSelectionne, 
    questionnaires, 
    changerEnfant,
    dateDuJour,
    dernierQuestionnaire,
    emotionDetails,
    activiteRecommandee,
  } = useParentTableauDeBord(parentConnecte);

  return (
    <View style={styles.mainWrapper}>
      <FondOnde />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* EN-TÊTE : Accueille le parent et permet de naviguer vers l'Accueil et les paramètres du Compte */}
        <PageHeader 
          subtitle="Bonjour,"
          title={parentConnecte?.email ? parentConnecte.email.split("@")[0] : "Parent"}
          showHome={true}
          showAccount={true}
        />

        {/* SÉLECTEUR D'ENFANT : Liste horizontale permettant au parent de basculer entre les enfants */}
        <ChildSelector
          enfants={enfants}
          selectedChildId={enfantSelectionne?.id_enfant}
          onSelectChild={changerEnfant}
          onAddChild={() => router.push("/ajout_enfant")}
        />

        {/* CARTE D'INFO DU JOUR : Résume l'humeur de l'enfant et l'activité recommandée */}
        <Card style={{ marginBottom: 25 }}>
          <View style={styles.headerCarte}>
            <Pastille text="MOOD DU JOUR" />
            <Text style={styles.enfantLabel}>{enfantSelectionne?.prenom || "---"}</Text>
          </View>

          {/* AFFICHAGE DE L'ÉMOTION : Affiche l'émotion principale, l'intensité et le lieu si disponible */}
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
                      <Text style={styles.statValeur} style={{ color:"#5D4037" }}>{dernierQuestionnaire.lieu_nom || "---"}</Text>
                  </View>
                </View>
              </View>
            ) : (
              <Text style={styles.infoVide}>Pas encore de réponse aujourd'hui.</Text>
            )}
          </View>

          {/* ACTIVITÉ RECOMMANDÉE : Guidée par le service de recommandation basé sur l'humeur */}
          <View style={styles.ligneActivite}>
            <View style={styles.iconActivite}>
              <MaterialCommunityIcons name={activiteRecommandee ? activiteRecommandee.icon : "auto-fix"} size={20} 
                color={ activiteRecommandee ? activiteRecommandee.color : COLORS.primary}
              />
            </View>
            <View>
              <Text style={styles.labelActivite}>Mini-jeu suggéré :</Text>
              <Text style={styles.valeurActivite}>
                {activiteRecommandee ? activiteRecommandee.titre : "En attente du questionnaire"}
              </Text>
            </View>
          </View> 

          <View style={styles.footerCarte}>
            <Text style={styles.dateTexte}>{dateDuJour}</Text>
            <Button 
              title="CONSEILS" 
              style={styles.boutonConseils} 
              textStyle={styles.boutonConseilsTexte} 
            />
          </View>
        </Card>

        {/* SECTION HISTORIQUE : Liste les 5 dernières entrées émotionnelles pour l'enfant sélectionné */}
        <View style={styles.sectionHeader}>
           <Text style={styles.titreSection}>Historique</Text>
           <MaterialCommunityIcons name="history" size={20} color={COLORS.textLight} />
        </View>

        <View style={styles.carteHistorique}>
          {questionnaires.length > 0 ? (
            questionnaires.slice(0, 5).map((q, index, array) => {
              const isLast = index === array.length - 1; 
              return (
                <HistoryItem
                  key={q.id_questionnaire || index}
                  intensity={q.intensite_emotion}
                  date={q.date_questionnaire}
                  emotion_nom={q.emotion_nom}
                  isLast={isLast}
                />
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
  
  infoVide: { fontSize: 14, color: COLORS.textLight, fontStyle: "italic", textAlign: "center" },
});