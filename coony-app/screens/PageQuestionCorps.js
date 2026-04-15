import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useQuestionnaire } from "../state/QuestionnaireState";
import { getEmotionDetails } from "../utils/EmotionMapper";
import COLORS from "../utils/Colors";
import FondOnde from "../components/FondOnde";

export default function Corps() {
  const { questionnaire, mettreAJourQuestionnaire } = useQuestionnaire();
  const [signalSelectionne, setSignalSelectionne] = useState(null);

  const emotionDetails = getEmotionDetails(questionnaire.emotionLabel) || { color: COLORS.primary };

  const signaux = [
    { id: 1, label: "Coeur rapide", icon: "heart-pulse" },
    { id: 2, label: "Tout va bien", icon: "emoticon-neutral-outline" }, // Plus parlant pour "Normal"
    { id: 3, label: "Ventre serré", icon: "vibrate" }, // Évoque le noeud/contraction
    { id: 4, label: "Corps tendu", icon: "lightning-bolt" },
    { id: 5, label: "Fatigué", icon: "sleep" },
    { id: 6, label: "Je ne sais pas", icon: "help-circle-outline" }
  ];

  const handleValidation = () => {
    if (!signalSelectionne) return;
    mettreAJourQuestionnaire({
      idSignalCorporel: Number(signalSelectionne.id),
      signalLabel: signalSelectionne.label,
    });
    router.push("/questionnaire/lieu");
  };

  return (
    <View style={styles.mainWrapper}>
      <FondOnde />
      
      {/* --- HEADER AVEC PROGRESSION --- */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerNav}>
          <TouchableOpacity style={styles.boutonCercle} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={26} color={COLORS.textLight} />
          </TouchableOpacity>
          <View style={styles.badgeEtape}>
             <Text style={styles.titreEtape}>Étape 3 / 4</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionTexte}>
          <Text style={styles.intro}>D’accord ! ✨</Text>
          <Text style={styles.titre}>Est-ce que tu ressens quelque chose dans ton corps ?</Text>
        </View>

        <View style={styles.grille}>
          {signaux.map((signal) => {
            const selectionne = signalSelectionne?.id === signal.id;
            return (
              <TouchableOpacity
                key={signal.id}
                style={[
                  styles.bouton,
                  selectionne && { borderColor: emotionDetails.color, borderWidth: 2 }
                ]}
                onPress={() => setSignalSelectionne(signal)}
              >
                <View style={[styles.cercleIcone, selectionne && { backgroundColor: emotionDetails.color + '15' }]}>
                  <MaterialCommunityIcons 
                    name={signal.icon} 
                    size={32} 
                    color={selectionne ? emotionDetails.color : COLORS.textLight} 
                  />
                </View>
                <Text style={[styles.texteBouton, selectionne && { color: emotionDetails.color, fontWeight: "900" }]}>
                  {signal.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {signalSelectionne && (
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.boutonValidation, { backgroundColor: emotionDetails.color }]}
              onPress={handleValidation}
            >
              <Text style={styles.texteValidation}>On continue</Text>
              <MaterialCommunityIcons name="arrow-right" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1},
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