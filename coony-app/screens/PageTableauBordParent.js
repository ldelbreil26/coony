
import { useCallback, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, Switch } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useSessionParent } from "../state/SessionParent";
import { listerEnfantsDuParent, listerQuestionnairesEnfant } from "../db/requetesMetier";

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function PageTableauBordParent() {
  const { parentConnecte } = useSessionParent();

  const [enfants, setEnfants] = useState([]);
  const [enfantSelectionne, setEnfantSelectionne] = useState(null);
  const [questionnaires, setQuestionnaires] = useState([]);

  const chargerDonnees = async () => {
    try {
      if (!parentConnecte?.id_parent) return;

      const listeEnfants = await listerEnfantsDuParent(parentConnecte.id_parent);
      setEnfants(listeEnfants);

      if (listeEnfants.length > 0) {
        const premierEnfant = listeEnfants[0];
        setEnfantSelectionne(premierEnfant);

        const listeQuestionnaires = await listerQuestionnairesEnfant(
          premierEnfant.id_enfant
        );
        setQuestionnaires(listeQuestionnaires);
      } else {
        setEnfantSelectionne(null);
        setQuestionnaires([]);
      }
    } catch (error) {
      console.error("Erreur chargement dashboard :", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      chargerDonnees();
    }, [parentConnecte])
  );

  const dernierQuestionnaire = questionnaires.length > 0 ? questionnaires[0] : null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.bonjour}>
          Bonjour {parentConnecte?.email ? parentConnecte.email.split("@")[0] : ""}
        </Text>

        <TouchableOpacity
          style={styles.boutonProfil}
          onPress={() => router.push("/compte_parent")} >
          <Text style={styles.boutonProfilTexte}><MaterialCommunityIcons name="account" size={24} color="#333" /></Text>
        </TouchableOpacity>
      </View>

      <View style={styles.carte}>
        <View style={styles.headerCarte}>
          <View style={styles.pastille}>
            <Text style={styles.pastilleTexte}>INFOS DU JOUR</Text>
          </View>

          <Text style={styles.enfantTexte}>
            {enfantSelectionne
              ? `Enfant 1 : ${enfantSelectionne.prenom}`
              : "Aucun enfant"}
          </Text>
        </View>

        <View style={styles.grandBloc}>
          {dernierQuestionnaire ? (
            <View>
              <Text style={styles.infoTexte}>
                Dernière émotion ID : {dernierQuestionnaire.id_emotion}
              </Text>
              <Text style={styles.infoTexte}>
                Intensité : {dernierQuestionnaire.intensite_emotion}/5
              </Text>
              <Text style={styles.infoTexte}>
                Lieu ID : {dernierQuestionnaire.id_lieu ?? "Non renseigné"}
              </Text>
            </View>
          ) : (
            <Text style={styles.infoVide}>
              Aucun questionnaire enregistré pour aujourd’hui.
            </Text>
          )}
        </View>

        <View style={styles.ligneMiniJeu}>
          <Text style={styles.labelMiniJeu}>Mini jeu du jour :</Text>
          <View style={styles.champMiniJeu}>
            <Text style={styles.champMiniJeuTexte}>
              {dernierQuestionnaire ? "À venir" : ""}
            </Text>
          </View>
        </View>

        <View style={styles.footerCarte}>
          <Text style={styles.dateTexte}>
            {dernierQuestionnaire?.date_questionnaire || "JJ / MM / AAAA"}
          </Text>

          <TouchableOpacity style={styles.boutonConseils}>
            <Text style={styles.boutonConseilsTexte}>CONSEILS</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.carteBas}>
        {questionnaires.length > 0 ? (
          questionnaires.slice(0, 5).map((q) => (
            <View key={q.id_questionnaire} style={styles.ligneHistorique}>
              <Text style={styles.historiqueTexte}>
                {q.date_questionnaire} — émotion {q.id_emotion} — intensité {q.intensite_emotion}/5
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.infoVide}>
            Aucun historique disponible.
          </Text>
        )}
      </View>

      <View style={styles.footerBoutons}>
        <TouchableOpacity style={styles.boutonMenu}>
          <Text style={styles.boutonMenuTexte}>Menu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.boutonAide}>
          <Text style={styles.boutonAideTexte}>?</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 70,
    paddingBottom: 40,
    backgroundColor: "#F4F4F4",
    flexGrow: 1,
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
  boutonProfil: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#EDE7E7",
    justifyContent: "center",
    alignItems: "center",
  },
  boutonProfilTexte: {
    fontSize: 20,
  },
  carte: {
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    padding: 16,
    marginBottom: 26,
  },
  headerCarte: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  pastille: {
    backgroundColor: "#F3F3F3",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  pastilleTexte: {
    fontWeight: "700",
    fontSize: 16,
    color: "#333",
  },
  enfantTexte: {
    fontSize: 15,
    color: "#F5F5F5",
    fontStyle: "italic",
    fontWeight: "600",
  },
  grandBloc: {
    backgroundColor: "#F4F4F4",
    borderRadius: 18,
    minHeight: 125,
    padding: 16,
    marginBottom: 18,
    justifyContent: "center",
  },
  infoTexte: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  infoVide: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  ligneMiniJeu: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  labelMiniJeu: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
    marginRight: 8,
  },
  champMiniJeu: {
    flex: 1,
    height: 28,
    backgroundColor: "#F3F3F3",
    borderRadius: 14,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  champMiniJeuTexte: {
    color: "#333",
    fontSize: 14,
  },
  footerCarte: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateTexte: {
    fontSize: 14,
    color: "#333",
  },
  boutonConseils: {
    backgroundColor: "#F3F3F3",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  boutonConseilsTexte: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
  },
  carteBas: {
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    minHeight: 170,
    padding: 18,
    marginBottom: 32,
  },
  ligneHistorique: {
    marginBottom: 12,
  },
  historiqueTexte: {
    fontSize: 14,
    color: "#333",
  },
  footerBoutons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  boutonMenu: {
    backgroundColor: "#EDE7E7",
    borderRadius: 18,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  boutonMenuTexte: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  boutonAide: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EDE7E7",
    justifyContent: "center",
    alignItems: "center",
  },
  boutonAideTexte: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
});