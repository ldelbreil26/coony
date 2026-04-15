import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useQuestionnaire } from "../../../src/state/questionnaireState";
import { getEmotionDetailsById } from "../../../src/utils/mapper/emotionMapper";
import COLORS from "../../../src/utils/colors";
import FondOnde from "../../../src/components/FondOnde";

const { height } = Dimensions.get("window");

export default function IntensiteBulles() {
  const { questionnaire, mettreAJourQuestionnaire } = useQuestionnaire();
  const [intensite, setIntensite] = useState(3);

  const emotionDetails =
    getEmotionDetailsById(questionnaire?.idEmotion) || {
      color: COLORS.primary,
      iconName: "emoticon-outline",
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