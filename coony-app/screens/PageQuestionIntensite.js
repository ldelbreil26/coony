import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useQuestionnaire } from "../state/QuestionnaireState";
import { getEmotionDetails } from "../utils/EmotionMapper";
import COLORS from "../utils/Colors";
import FondOnde from "../components/FondOnde";

const { height } = Dimensions.get("window");

// JOIE / TRISTESSE / AUTRE : problème d'appel dans le emotionMapper : différences entre Triste et tristesse ?

export default function IntensiteBulles() {
  const { questionnaire, mettreAJourQuestionnaire } = useQuestionnaire();
  console.log("Données du questionnaire reçues :", questionnaire);
  const [intensite, setIntensite] = useState(3); // Valeur par défaut au milieu (1 à 5)

  const emotionDetails = getEmotionDetails(questionnaire.emotionLabel) || {
    color: COLORS.primary,
    iconName: "emoticon-happy"
  };

  const niveaux = [
    { val: 1, label: "Un petit peu" },
    { val: 2, label: "Un  peu" },
    { val: 3, label: "Moyen" },
    { val: 4, label: "Beaucoup !" },
    { val: 5, label: "Énormément !!" },
  ];

  const handleValidation = () => {
    mettreAJourQuestionnaire({ intensiteEmotion: intensite });
    router.push("/questionnaire/corps");
  };

  return (
    <View style={styles.mainWrapper}>
      <FondOnde />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerNav}>
          <TouchableOpacity style={styles.boutonCercle} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={26} color={COLORS.textLight} />
          </TouchableOpacity>
          <View style={styles.badgeEtape}>
             <Text style={styles.titreEtape}>Étape 2 / 4</Text>
          </View>
        </View>
      </SafeAreaView>

      <View style={styles.container}>
        <View style={styles.sectionTexte}>
          <Text style={styles.intro}>C'est noté !</Text>
          <Text style={styles.titre}>C'est fort comment ?</Text>
        </View>

        {/* --- ZONE VISUELLE DES BULLES TACTILES --- */}
        <View style={styles.zoneBulles}>
            
            {/* L'ÉMOJI CENTRAL QUI RÉAGIT */}
            <View style={styles.illustration}>
                <View style={[styles.cercleIcone, { borderColor: emotionDetails.color + '30' }]}>
                    <MaterialCommunityIcons 
                        name={emotionDetails.iconName} 
                        size={80 + (intensite * 10)} // L'émoji grossit avec l'intensité
                        color={emotionDetails.color} 
                    />
                </View>
            </View>

            {/* LES BULLES CLIQUABLES (DU PLUS FORT AU PLUS FAIBLE) */}
            <View style={styles.listeBulles}>
                {niveaux.slice().reverse().map((niveauObj) => {
                    const estSelectionne = intensite === niveauObj.val;
                    // La taille de la bulle augmente avec l'intensité
                    const tailleBulle = 55 + niveauObj.val * 5; 
                    
                    return (
                        <TouchableOpacity
                            key={niveauObj.val}
                            style={[
                                styles.bulleIntensite,
                                { height: tailleBulle, borderRadius: tailleBulle / 2 },
                                estSelectionne && { 
                                    backgroundColor: emotionDetails.color,
                                    borderColor: emotionDetails.color,
                                    elevation: 6,
                                    transform: [{ scale: 1.1 }]
                                }
                            ]}
                            onPress={() => setIntensite(niveauObj.val)}
                            activeOpacity={0.9}
                        >
                            <Text style={[
                                styles.texteBulle,
                                { fontSize: 13 + niveauObj.val * 0.8 },
                                estSelectionne && { color: COLORS.white, fontWeight: "900" }
                            ]}>
                                {niveauObj.label}
                            </Text>
                            {estSelectionne && (
                                <MaterialCommunityIcons name="check-circle" size={22} color={COLORS.white} />
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.boutonSuivant, { backgroundColor: emotionDetails.color }]} 
            onPress={handleValidation}
          >
            <Text style={styles.texteSuivant}>On continue</Text>
            <MaterialCommunityIcons name="arrow-right" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1 },
  safeArea: { zIndex: 10 },
  headerNav: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, justifyContent: 'space-between' },
  boutonCercle: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white,
    justifyContent: "center", alignItems: "center", elevation: 3,
  },
  badgeEtape: { backgroundColor: 'rgba(255,255,255,0.6)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  titreEtape: { fontSize: 13, fontWeight: "900", color: COLORS.textLight, textTransform: "uppercase" },
  
  container: { flex: 1, paddingHorizontal: 25, paddingBottom: 30, justifyContent: 'space-between' },
  sectionTexte: { marginTop: 20 },
  intro: { fontSize: 18, fontWeight: "600", color: COLORS.primary, marginBottom: 5 },
  titre: { fontSize: 28, fontWeight: "900", color: COLORS.text, lineHeight: 34 },

  // Zone Bulles
  zoneBulles: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: height * 0.5,
    marginVertical: 20,
  },
  illustration: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cercleIcone: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 3,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    elevation: 3
  },

  // Liste Bulles
  listeBulles: {
    flex: 1,
    gap: 12,
    alignItems: 'flex-end', // Aligné à droite
  },
  bulleIntensite: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 160,
  },
  texteBulle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: 'center',
  },

  footer: { width: '100%', marginTop: 'auto' },
  boutonSuivant: { height: 65, borderRadius: 22, flexDirection: 'row', justifyContent: "center", alignItems: "center", gap: 10, elevation: 4 },
  texteSuivant: { fontSize: 20, fontWeight: "900", color: COLORS.white }
});