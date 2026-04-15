import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useQuestionnaire } from "../state/QuestionnaireState";
import { getEmotionDetails } from "../utils/EmotionMapper";
import COLORS from "../utils/Colors";
import FondOnde from "../components/FondOnde";

export default function Lieu() {
  const { questionnaire, mettreAJourQuestionnaire } = useQuestionnaire();
  const [lieuSelectionne, setLieuSelectionne] = useState(null);

  // Utilisation de la couleur de l'émotion pour la cohérence
  const emotionDetails = getEmotionDetails(questionnaire.emotionLabel) || { color: COLORS.primary };


  // voir pour le catalogue de la base de donnée ?
  const lieux = [
    { id: 1, label: "À la maison", icon: "home-variant" },
    { id: 2, label: "À l’école", icon: "school" },
    { id: 3, label: "Dehors", icon: "tree" },
    { id: 4, label: "Dans la voiture", icon: "car" },
    { id: 5, label: "Avec quelqu’un", icon: "account-group" },
    { id: 6, label: "Je ne sais pas", icon: "help-circle-outline" }
  ];

  const handleValidation = () => {
    if (!lieuSelectionne) return;

    mettreAJourQuestionnaire({
      idLieu: Number(lieuSelectionne.id),
      lieuLabel: lieuSelectionne.label,
    });

    router.push("/questionnaire/resultat");
  };

  return (
    <View style={styles.mainWrapper}>
      <FondOnde />
      
      {/* --- HEADER ÉTAPE 4/4 --- */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerNav}>
          <TouchableOpacity style={styles.boutonCercle} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={26} color={COLORS.textLight} />
          </TouchableOpacity>
          <View style={styles.badgeEtape}>
             <Text style={styles.titreEtape}>Étape 4 / 4</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionTexte}>
          <Text style={styles.intro}>Presque fini ! </Text>
          <Text style={styles.titre}>Tu étais où à ce moment-là ?</Text>
        </View>

        <View style={styles.grille}>
          {lieux.map((lieu) => {
            const selectionne = lieuSelectionne?.id === lieu.id;
            return (
              <TouchableOpacity
                key={lieu.id}
                style={[
                  styles.bouton,
                  selectionne && { borderColor: emotionDetails.color, borderWidth: 2 }
                ]}
                onPress={() => setLieuSelectionne(lieu)}
              >
                <View style={[styles.cercleIcone, selectionne && { backgroundColor: emotionDetails.color + '15' }]}>
                  <MaterialCommunityIcons 
                    name={lieu.icon} 
                    size={32} 
                    color={selectionne ? emotionDetails.color : COLORS.textLight} 
                  />
                </View>
                <Text style={[styles.texteBouton, selectionne && { color: emotionDetails.color, fontWeight: "900" }]}>
                  {lieu.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {lieuSelectionne && (
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.boutonValidation, { backgroundColor: emotionDetails.color }]}
              onPress={handleValidation}
            >
              <Text style={styles.texteValidation}>Voir mon résultat</Text>
              <MaterialCommunityIcons name="check-circle" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1 },
  safeArea: { zIndex: 10 },
  headerNav: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 10, 
    justifyContent: 'space-between' 
  },
  boutonCercle: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white,
    justifyContent: "center", alignItems: "center", elevation: 3,
  },
  badgeEtape: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20,
  },
  titreEtape: { fontSize: 14, fontWeight: "900", color: COLORS.text, textTransform: "uppercase" },

  container: { paddingHorizontal: 25, paddingTop: 30, paddingBottom: 40 },
  
  sectionTexte: { marginBottom: 30 },
  intro: { fontSize: 18, fontWeight: "600", color: COLORS.primary, marginBottom: 5 },
  titre: { fontSize: 24, fontWeight: "900", color: COLORS.text, lineHeight: 32 },

  grille: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15,
    marginBottom: 30
  },
  bouton: {
    width: "47%",
    backgroundColor: COLORS.white,
    borderRadius: 22,
    paddingVertical: 20,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  cercleIcone: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 10
  },
  texteBouton: { fontSize: 15, fontWeight: "700", color: COLORS.text, textAlign: "center" },

  footer: { marginTop: 10 },
  boutonValidation: {
    height: 65, borderRadius: 22,
    flexDirection: 'row', justifyContent: "center", alignItems: "center",
    gap: 12, elevation: 4
  },
  texteValidation: { fontSize: 20, fontWeight: "900", color: COLORS.white }
});