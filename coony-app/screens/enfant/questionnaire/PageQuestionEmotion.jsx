import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useQuestionnaire } from "../../../src/state/questionnaireState";
import { EMOTIONS } from "../../../src/utils/mapper/emotionMapper"; 
import COLORS from "../../../src/utils/colors";
import FondOnde from "../../../src/components/FondOnde";
import EnteteQuestionnaire from "../../../src/components/EnteteQuestionnaire";

export default function Emotion() {
  const { mettreAJourQuestionnaire } = useQuestionnaire();
  const [emotionSelectionnee, setEmotionSelectionnee] = useState(null);

  const listeEmotions = Object.keys(EMOTIONS).map(key => ({
    key: key,
    ...EMOTIONS[key]
  }));

  const handleValidation = () => {
    if (!emotionSelectionnee) return;
    
    mettreAJourQuestionnaire({
      idEmotion: emotionSelectionnee.id,
      emotionLabel: emotionSelectionnee.label,
    });

    router.push("/questionnaire/intensite");
  };

  return (
    <View style={styles.mainWrapper}>
      <FondOnde />
      
      <EnteteQuestionnaire etape={1} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionTexte}>
            <Text style={styles.intro}>Dis-moi tout...</Text>
            <Text style={styles.titre}>Comment tu te sens ?</Text>
        </View>

        <View style={styles.grille}>
          {listeEmotions.map((emotion) => {
            const estSelectionnee = emotionSelectionnee?.id === emotion.id;
            
            return (
              <TouchableOpacity
                key={emotion.id}
                style={[
                  styles.boutonEmotion,
                  estSelectionnee && { 
                    backgroundColor: emotion.color, 
                    transform: [{ scale: 1.05 }],
                    elevation: 10
                  },
                ]}
                onPress={() => setEmotionSelectionnee(emotion)}
                activeOpacity={0.8}
              >
                <View style={[
                    styles.conteneurIcone, 
                    { backgroundColor: estSelectionnee ? 'rgba(255,255,255,0.2)' : emotion.color + '15' }
                ]}>
                    <MaterialCommunityIcons 
                        name={emotion.iconName} 
                        size={45} 
                        color={estSelectionnee ? COLORS.white : emotion.color} 
                    />
                </View>
                <Text style={[
                    styles.texteBouton,
                    estSelectionnee && { color: COLORS.white }
                ]}>
                    {emotion.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {emotionSelectionnee && (
          <View style={styles.footer}>
            <TouchableOpacity 
              style={[
                styles.boutonSuivant, 
                { backgroundColor: emotionSelectionnee.color }
              ]} 
              onPress={handleValidation}
            >
              <Text style={styles.texteSuivant}>C'est bien ça !</Text>
              <MaterialCommunityIcons name="check-bold" size={24} color={COLORS.white} />
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  badgeEtape: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  titreEtape: {
    fontSize: 13,
    fontWeight: "900",
    color: COLORS.textLight,
    textTransform: "uppercase",
  },
  container: {
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 40,
  },
  sectionTexte: { marginBottom: 35 },
  intro: { fontSize: 18, fontWeight: "600", color: COLORS.primary, marginBottom: 5 },
  titre: { fontSize: 28, fontWeight: "900", color: COLORS.text, lineHeight: 34 },
  
  grille: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15,
  },
  boutonEmotion: {
    width: "47%",
    paddingVertical: 20,
    backgroundColor: COLORS.white,
    borderRadius: 30,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  conteneurIcone: {
    width: 75,
    height: 75,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  texteBouton: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.text,
  },
  footer: {
    marginTop: 40,
    width: '100%',
  },
  boutonSuivant: {
    height: 70,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
  },
  texteSuivant: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.white,
    letterSpacing: 0.5,
  },
});