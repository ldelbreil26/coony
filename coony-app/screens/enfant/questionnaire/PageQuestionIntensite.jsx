import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useQuestionnaire } from "../../../src/state/questionnaireState";
import { mapEmotion } from "../../../src/utils/mapper/emotionMapper";
import COLORS from "../../../src/utils/colors";
import FondOnde from "../../../src/components/FondOnde";
import EnteteQuestionnaire from "../../../src/components/EnteteQuestionnaire";

const { height } = Dimensions.get("window");

export default function IntensiteBulles() {
  const { questionnaire, mettreAJourQuestionnaire } = useQuestionnaire();
  const [intensite, setIntensite] = useState(3);

  const emotionDetails =
    mapEmotion(questionnaire?.idEmotion) || {
      color: COLORS.primary,
      iconName: "emoticon-happy",
    };

  const niveaux = [
    { val: 1, label: "Un petit peu" },
    { val: 2, label: "Un peu" },
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

      <EnteteQuestionnaire etape={2} />

      <View style={styles.container}>
        <View style={styles.sectionTexte}>
          <Text style={styles.intro}>C'est noté !</Text>
          <Text style={styles.titre}>C'est fort comment ?</Text>
        </View>

        <View style={styles.zoneBulles}>
          <View style={styles.illustration}>
            <View
              style={[
                styles.cercleIcone,
                { borderColor: emotionDetails.color + "30" },
              ]}
            >
              <MaterialCommunityIcons
                name={emotionDetails.iconName}
                size={80 + intensite * 10}
                color={emotionDetails.color}
              />
            </View>
          </View>

          <View style={styles.listeBulles}>
            {niveaux
              .slice()
              .reverse()
              .map((niveauObj) => {
                const estSelectionne = intensite === niveauObj.val;
                const tailleBulle = 55 + niveauObj.val * 5;

                return (
                  <TouchableOpacity
                    key={niveauObj.val}
                    style={[
                      styles.bulleIntensite,
                      {
                        height: tailleBulle,
                        borderRadius: tailleBulle / 2,
                      },
                      estSelectionne && {
                        backgroundColor: emotionDetails.color,
                        borderColor: emotionDetails.color,
                        elevation: 6,
                        transform: [{ scale: 1.1 }],
                      },
                    ]}
                    onPress={() => setIntensite(niveauObj.val)}
                    activeOpacity={0.9}
                  >
                    <Text
                      style={[
                        styles.texteBulle,
                        { fontSize: 13 + niveauObj.val * 0.8 },
                        estSelectionne && {
                          color: COLORS.white,
                          fontWeight: "900",
                        },
                      ]}
                    >
                      {niveauObj.label}
                    </Text>

                    {estSelectionne && (
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={22}
                        color={COLORS.white}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.boutonSuivant,
              { backgroundColor: emotionDetails.color },
            ]}
            onPress={handleValidation}
          >
            <Text style={styles.texteSuivant}>On continue</Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={24}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1 },
  
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