import { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useQuestionnaire } from "../../../src/state/questionnaireState";
import { creerQuestionnaire } from "../../../src/data/repositories/questionnaire.repo";
import { matchRecommandation } from "../../../src/services/recommendation.service";

import { getEmotionDetails } from "../../../src/utils/mapper/emotionMapper";
import { fetchMiniJeu } from "../../../src/utils/mapper/miniJeuMapper";
import COLORS from "../../../src/utils/colors";
import FondOnde from "../../../src/components/FondOnde";

export default function ResultatQuestionnaire() {
  const { questionnaire, reinitialiserQuestionnaire } = useQuestionnaire();

  const {
    idEnfant, prenom, idEmotion, emotionLabel, intensiteEmotion,
    idSignalCorporel, signalLabel, idLieu, lieuLabel,
  } = questionnaire;

  const recommandation = useMemo(() => {
    return matchRecommandation(idEmotion, intensiteEmotion, idSignalCorporel);
  }, [idEmotion, intensiteEmotion, idSignalCorporel]);

  const jeuDetails = useMemo(() => {
    return fetchMiniJeu(recommandation.idMiniJeu);
  }, [recommandation.idMiniJeu]);

  const emotionTheme = getEmotionDetails(emotionLabel) || { color: COLORS.primary };

  const lancerMiniJeu = async () => {
    try {
     await creerQuestionnaire({
      idEnfant,
      idEmotion,
      intensiteEmotion,
      idSignalCorporel,
      idLieu,
    });

      const routeJeu = jeuDetails?.route || `/mini-jeu/${recommandation.idMiniJeu}`;
      
      reinitialiserQuestionnaire();
      router.replace(routeJeu);

    } catch (error) {
      console.error("Erreur enregistrement :", error);
    }
  };

  return (
    <View style={styles.mainWrapper}>
      <FondOnde />
      
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        <View style={styles.headerSucces}>
          <View style={[styles.cercleIcone, { backgroundColor: emotionTheme.color }]}>
            <MaterialCommunityIcons name="check" size={40} color={COLORS.white} />
          </View>
          <Text style={styles.bravoTexte}>BRAVO {prenom?.toUpperCase()} !</Text>
          <Text style={styles.sousTitre}>Tu as fini ton check-in.</Text>
        </View>

        <View style={styles.carteResultat}>
          <Text style={styles.messageAnalyse}>{recommandation.message}</Text>
          
          <View style={styles.separateur} />
          
          <Text style={styles.propositionTexte}>Pour t'aider, je te propose :</Text>
          
          <View style={[styles.boxJeu, { borderColor: jeuDetails?.color || emotionTheme.color }]}>
            <View style={[styles.iconeJeuCercle, { backgroundColor: jeuDetails?.color || emotionTheme.color }]}>
              <MaterialCommunityIcons 
                name={jeuDetails?.icon || "star"} 
                size={35} 
                color={COLORS.white} 
              />
            </View>
            <View style={styles.jeuInfos}>
              <Text style={styles.jeuNom}>{jeuDetails?.titre || recommandation.miniJeu}</Text>
              <Text style={styles.jeuSlogan}>Ta mission spéciale du jour</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.boutonAction, { backgroundColor: emotionTheme.color }]} 
          onPress={lancerMiniJeu}
        >
          <Text style={styles.boutonTexte}>C'EST PARTI !</Text>
          <MaterialCommunityIcons name="rocket-launch" size={24} color={COLORS.white} />
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1 },
  container: { paddingHorizontal: 25, paddingTop: 150, paddingBottom: 40 },
  
  headerSucces: { alignItems: 'center', marginBottom: 30 },
  cercleIcone: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15, elevation: 5 },
  bravoTexte: { fontSize: 24, fontWeight: "900", color: COLORS.text, letterSpacing: 1 },
  sousTitre: { fontSize: 16, color: COLORS.textLight, fontWeight: "600" },

  carteResultat: {
    backgroundColor: COLORS.white,
    borderRadius: 30,
    padding: 25,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 30
  },
  messageAnalyse: { fontSize: 18, color: COLORS.text, textAlign: 'center', lineHeight: 26, fontWeight: "600" },
  separateur: { height: 1, backgroundColor: '#EEE', marginVertical: 20 },
  propositionTexte: { fontSize: 14, color: COLORS.textLight, fontWeight: "700", textAlign: 'center', marginBottom: 15, textTransform: 'uppercase' },

  boxJeu: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    backgroundColor: '#F9F9F9'
  },
  iconeJeuCercle: { width: 60, height: 60, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  jeuInfos: { marginLeft: 15, flex: 1 },
  jeuNom: { fontSize: 20, fontWeight: "900", color: COLORS.text },
  jeuSlogan: { fontSize: 13, color: COLORS.textLight, fontWeight: "600" },

  boutonAction: {
    height: 70,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    elevation: 6
  },
  boutonTexte: { fontSize: 22, fontWeight: "900", color: COLORS.white, letterSpacing: 1 }
});