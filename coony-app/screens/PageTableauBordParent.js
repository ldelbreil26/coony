import { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useSessionParent } from "../state/SessionParent";
import { listerEnfantsDuParent, listerQuestionnairesEnfant } from "../db/requetesMetier";

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getDateDuJourFormatee } from "../utils/UtilsDate";

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

  // Changer d'enfant au clic
  const changerEnfant = (enfant) => {
    setEnfantSelectionne(enfant);
    chargerHistorique(enfant.id_enfant);
  };

  const dernierQuestionnaire = questionnaires.length > 0 ? questionnaires[0] : null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.bonjour}>
          Bonjour {parentConnecte?.email ? parentConnecte.email.split("@")[0] : "Parent"}
        </Text>
        <TouchableOpacity style={styles.boutonProfil} onPress={() => router.push("/compte_parent")}>
          <MaterialCommunityIcons name="account" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* SELECTEUR D'ENFANT (SI PLUSIEURS) */}
      <View style={styles.selecteurContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
             <MaterialCommunityIcons name="plus" size={18} color="#666" />
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* CARTE INFOS DU JOUR */}
      <View style={styles.carte}>
        <View style={styles.headerCarte}>
          <View style={styles.pastille}>
            <Text style={styles.pastilleTexte}>INFOS DU JOUR</Text>
          </View>
          <Text style={styles.enfantLabel}>
            {enfantSelectionne?.prenom || "---"}
          </Text>
        </View>

        <View style={styles.grandBloc}>
          {dernierQuestionnaire ? (
            <View>
              <Text style={styles.infoTexte}>
                Émotion : <Text style={styles.valeur}>{dernierQuestionnaire.emotion_nom}</Text>
              </Text>
              <Text style={styles.infoTexte}>
                Intensité : <Text style={styles.valeur}>{dernierQuestionnaire.intensite_emotion}/5</Text>
              </Text>
              <Text style={styles.infoTexte}>
                Lieu : <Text style={styles.valeur}>{dernierQuestionnaire.lieu_nom || "Non précisé"}</Text>
              </Text>
            </View>
          ) : (
            <Text style={styles.infoVide}>Pas encore de check-in aujourd'hui.</Text>
          )}
        </View>

        <View style={styles.ligneMiniJeu}>
          <Text style={styles.labelMiniJeu}>Activité suggérée :</Text>
          <View style={styles.champMiniJeu}>
            <Text style={styles.champMiniJeuTexte}>
              {dernierQuestionnaire ? "Respiration 4-4" : "En attente"}
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
      <Text style={styles.titreSection}>Historique récent</Text>
      <View style={styles.carteBas}>
        {questionnaires.length > 0 ? (
          questionnaires.slice(0, 5).map((q, index) => (
            <View key={index} style={styles.ligneHistorique}>
              <MaterialCommunityIcons name="calendar-check" size={16} color="#666" />
              <Text style={styles.historiqueTexte}>
                {q.date_questionnaire.split(' ')[0]} : {q.emotion_nom} ({q.intensite_emotion}/5)
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.infoVide}>Aucun historique pour cet enfant.</Text>
        )}
      </View>

      {/* NAVIGATION BAS */}
      <View style={styles.footerBoutons}>
        <TouchableOpacity style={styles.boutonMenu} onPress={() => router.push("/menu")}>
          <Text style={styles.boutonMenuTexte}>Menu Principal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.boutonAide}>
          <Text style={styles.boutonAideTexte}>?</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 60, paddingBottom: 40, backgroundColor: "#F4F4F4", flexGrow: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  bonjour: { fontSize: 18, fontWeight: "700", color: "#333" },
  boutonProfil: { width: 46, height: 46, borderRadius: 23, backgroundColor: "#D9D9D9", justifyContent: "center", alignItems: "center" },
  
  selecteurContainer: { marginBottom: 20, flexDirection: "row" },
  ongletEnfant: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 15, backgroundColor: "#E0E0E0", marginRight: 8 },
  ongletActif: { backgroundColor: "#333" },
  ongletTexte: { fontSize: 14, fontWeight: "600", color: "#666" },
  ongletTexteActif: { color: "#FFF" },
  ongletAjout: { width: 35, height: 35, borderRadius: 10, backgroundColor: "#D9D9D9", justifyContent: "center", alignItems: "center" },

  carte: { backgroundColor: "#D9D9D9", borderRadius: 20, padding: 16, marginBottom: 20 },
  headerCarte: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  pastille: { backgroundColor: "#F3F3F3", borderRadius: 18, paddingHorizontal: 12, paddingVertical: 6 },
  pastilleTexte: { fontWeight: "800", fontSize: 13, color: "#333" },
  enfantLabel: { fontSize: 14, fontWeight: "700", color: "#555" },

  grandBloc: { backgroundColor: "#F4F4F4", borderRadius: 18, minHeight: 100, padding: 15, marginBottom: 15, justifyContent: "center" },
  infoTexte: { fontSize: 15, color: "#444", marginBottom: 5 },
  valeur: { fontWeight: "800", color: "#000" },
  infoVide: { fontSize: 13, color: "#888", fontStyle: "italic", textAlign: "center" },

  ligneMiniJeu: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  labelMiniJeu: { fontSize: 14, color: "#333", fontWeight: "600", marginRight: 8 },
  champMiniJeu: { flex: 1, height: 32, backgroundColor: "#F3F3F3", borderRadius: 10, justifyContent: "center", paddingHorizontal: 10 },
  champMiniJeuTexte: { color: "#333", fontSize: 13, fontWeight: "700" },

  footerCarte: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  dateTexte: { fontSize: 13, color: "#666" },
  boutonConseils: { backgroundColor: "#333", borderRadius: 12, paddingHorizontal: 15, paddingVertical: 8 },
  boutonConseilsTexte: { fontSize: 12, fontWeight: "700", color: "#FFF" },

  titreSection: { fontSize: 16, fontWeight: "700", marginBottom: 10, color: "#333" },
  carteBas: { backgroundColor: "#D9D9D9", borderRadius: 20, padding: 15, marginBottom: 30 },
  ligneHistorique: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10, borderBottomWidth: 1, borderBottomColor: "#CCC", paddingBottom: 5 },
  historiqueTexte: { fontSize: 13, color: "#333" },

  footerBoutons: { flexDirection: "row", alignItems: "center", gap: 10 },
  boutonMenu: { flex: 1, backgroundColor: "#D9D9D9", borderRadius: 15, paddingVertical: 12, alignItems: "center" },
  boutonMenuTexte: { fontSize: 15, fontWeight: "700", color: "#333" },
  boutonAide: { width: 45, height: 45, borderRadius: 15, backgroundColor: "#D9D9D9", justifyContent: "center", alignItems: "center" },
  boutonAideTexte: { fontSize: 18, fontWeight: "700" },
});