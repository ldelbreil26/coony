/**
 * @component ResultatQuestionnaire
 * @description Écran de synthèse finale du questionnaire enfant.
 * Cet écran récupère les réponses stockées dans le contexte global, calcule la 
 * recommandation la plus adaptée via le service dédié, et gère la persistance 
 * finale en base de données avant de lancer le mini-jeu.
 */

import { useMemo, useState, useEffect } from "react";
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
import { creerRecommandation } from "../../../src/data/repositories/recommendation.repo";
import { nowSqlite } from "../../../src/utils/date";

export default function ResultatQuestionnaire() {
  // Accès aux données saisies durant tout le tunnel du questionnaire
  const { questionnaire, reinitialiserQuestionnaire } = useQuestionnaire();

  const {
    idEnfant, prenom, idEmotion, emotionLabel, intensiteEmotion,
    idSignalCorporel, signalLabel, idLieu, lieuLabel,
  } = questionnaire;

  /**
   * Calcul de la recommandation (Logique Métier).
   * useMemo évite de recalculer si les entrées n'ont pas changé.
   */
  const recommandation = useMemo(() => {
    return matchRecommandation(idEmotion, intensiteEmotion, idSignalCorporel);
  }, [idEmotion, intensiteEmotion, idSignalCorporel]);

  const [jeuDetails, setJeuDetails] = useState(null);

  /**
   * Récupération des détails visuels (titre, icône, couleur) du mini-jeu recommandé.
   */
  useEffect(() => {
    if (!recommandation?.idMiniJeu) return;
    fetchMiniJeu(recommandation.idMiniJeu).then(setJeuDetails);
  }, [recommandation?.idMiniJeu]);

  // Adaptation du thème visuel en fonction de l'émotion dominante
  const emotionTheme = getEmotionDetails(emotionLabel) || { color: COLORS.primary };
  const [enCours, setEnCours] = useState(false);

  /**
   * Procédure de finalisation :
   * 1. Enregistre le questionnaire complété en base.
   * 2. Enregistre la recommandation générée.
   * 3. Réinitialise l'état global pour le prochain check-in.
   * 4. Redirige vers l'activité suggérée.
   */
  const lancerMiniJeu = async () => {
    if (enCours) return;
    setEnCours(true);

    try {
      // Persistance du bilan émotionnel
      const idQuestionnaire = await creerQuestionnaire({
        idEnfant, idEmotion, intensiteEmotion, idSignalCorporel, idLieu,
      });

      // Persistance du lien avec le mini-jeu
      await creerRecommandation(idQuestionnaire, nowSqlite(), recommandation.idMiniJeu);

      // Navigation vers le mini-jeu
      const routeJeu = jeuDetails?.route || `/mini-jeu/${recommandation.idMiniJeu}`;
      router.replace(routeJeu);
      
      // Nettoyage du contexte global
      reinitialiserQuestionnaire();

    } catch (error) {
      console.error("Erreur enregistrement :", error);
    }
  };

  return (
    <View style={styles.mainWrapper}>
      <FondOnde />
            
      <TouchableOpacity style={styles.boutonFermer} onPress={() => router.push("/tableau_de_bord_enfant")}>
        <MaterialCommunityIcons name="close-circle" size={45} color={COLORS.textLight} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        <View style={styles.headerSucces}>
          <View style={[styles.cercleIcone, { backgroundColor: emotionTheme.color }]}>
            <MaterialCommunityIcons name="check" size={40} color={COLORS.white} />
          </View>
          <Text style={styles.bravoTexte}>BRAVO {prenom?.toUpperCase()} !</Text>
          <Text style={styles.sousTitre}>Tu as fini ton check-in.</Text>
        </View>

        <View style={styles.carteResultat}>
          {/* Affichage du message pédagogique issu du moteur de recommandation */}
          <Text style={styles.messageAnalyse}>{recommandation.message}</Text>
          
          <View style={styles.separateur} />
          
          <Text style={styles.propositionTexte}>Pour t'aider, je te propose :</Text>
          
          {jeuDetails ? (
            <View style={[styles.boxJeu, { borderColor: jeuDetails.color || emotionTheme.color }]}>
              <View style={[styles.iconeJeuCercle, { backgroundColor: jeuDetails.color || emotionTheme.color }]}>
                <MaterialCommunityIcons 
                  name={jeuDetails.icon || "star"} 
                  size={35} 
                  color={COLORS.white} 
                />
              </View>
              <View style={styles.jeuInfos}>
                <Text style={styles.jeuNom}>{jeuDetails.titre}</Text>
                <Text style={styles.jeuSlogan}>Ta mission spéciale du jour</Text>
              </View>
            </View>
          ) : (
            <Text style={{ textAlign: 'center' }}>Préparation de ta mission...</Text>
          )}
        </View>

        <TouchableOpacity 
          style={[
            styles.boutonAction, 
            { backgroundColor: emotionTheme.color, opacity: (jeuDetails && !enCours) ? 1 : 0.6 }
          ]} 
          onPress={lancerMiniJeu}
          disabled={!jeuDetails  || enCours}
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

  boutonFermer: {
    position: 'absolute',
    top: 50, 
    right: 20,
    zIndex: 9999,
    backgroundColor: 'white',
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5
  },

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