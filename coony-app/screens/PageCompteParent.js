import { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useSessionParent } from "../state/SessionParent";
import { listerEnfantsDuParent } from "../db/requetesMetier";

import Ionicons from '@expo/vector-icons/Ionicons';


export default function PageCompteParent() {
  const { parentConnecte } = useSessionParent();
  console.log(parentConnecte);

  const [enfants, setEnfants] = useState([]);

  const chargerEnfants = async () => {
    if (!parentConnecte?.id_parent) return;

    try {
      const resultat = await listerEnfantsDuParent(parentConnecte.id_parent);
      setEnfants(resultat);
    } catch (error) {
      console.error("Erreur chargement enfants :", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      chargerEnfants();
    }, [parentConnecte])
  );

  const motDePasseMasque = "••••••••";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.boutonRetour} onPress={() => router.back()}>
        <Ionicons name="return-up-back-outline" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.carte}>
        <View style={styles.pastille}>
          <Text style={styles.pastilleTexte}>PARENT</Text>
        </View>

        <View style={styles.ligneChamp}>
          <Text style={styles.label}>Mail :</Text>
          <View style={styles.inputLong}>
            <Text style={styles.valeur}>{parentConnecte?.email || ""}</Text>
          </View>
        </View>

        <View style={styles.ligneChamp}>
          <Text style={styles.label}>Mot de passe :</Text>
          <View style={styles.inputLong}>
            <Text style={styles.valeur}>{motDePasseMasque}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.preferences}>Préférences Système</Text>
      <View style={styles.separateurGlobal} />

      {enfants.length === 0 ? (
        <View style={styles.carte}>
          <View style={styles.pastille}>
            <Text style={styles.pastilleTexte}>ENFANT</Text>
          </View>

          <Text style={styles.aucunEnfant}>
            Aucun enfant enregistré pour le moment.
          </Text>
        </View>
      ) : (
        enfants.map((enfant, index) => (
          <View style={styles.carte} key={enfant.id_enfant}>
            <View style={styles.headerEnfant}>
              <View style={styles.pastille}>
                <Text style={styles.pastilleTexte}>ENFANT</Text>
              </View>
              <View style={styles.numero}>
                <Text style={styles.numeroTexte}>{index + 1}</Text>
              </View>
            </View>

            <View style={styles.ligneChamp}>
              <Text style={styles.label}>Prénom :</Text>
              <View style={styles.inputPetit}>
                <Text style={styles.valeur}>{enfant.prenom}</Text>
              </View>
            </View>

            <View style={styles.ligneChamp}>
              <Text style={styles.label}>Date de naissance :</Text>
              <View style={styles.inputDate}>
                <Text style={styles.valeur}>{enfant.date_naissance}</Text>
              </View>
            </View>
          </View>
        ))
      )}

      <TouchableOpacity
        style={styles.boutonAjout}
        onPress={() => router.push("/ajout_enfant")}
      >
        <Text style={styles.boutonAjoutTexte}>＋</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: "#F4F4F4",
    flexGrow: 1,
  },
  boutonRetour: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EDE7E7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 26,
  },
  boutonRetourTexte: {
    fontSize: 22,
    color: "#333",
    fontWeight: "600",
  },
  carte: {
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    padding: 18,
    marginBottom: 28,
  },
  pastille: {
    backgroundColor: "#F3F3F3",
    alignSelf: "flex-start",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 20,
  },
  pastilleTexte: {
    fontWeight: "700",
    fontSize: 16,
    color: "#333",
  },
  headerEnfant: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  numero: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F3F3F3",
    alignItems: "center",
    justifyContent: "center",
  },
  numeroTexte: {
    fontWeight: "700",
    color: "#333",
  },
  ligneChamp: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  label: {
    width: 130,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  inputPetit: {
    backgroundColor: "#F3F3F3",
    borderRadius: 14,
    height: 30,
    width: 110,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  inputLong: {
    backgroundColor: "#F3F3F3",
    borderRadius: 14,
    height: 30,
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  inputDate: {
    backgroundColor: "#F3F3F3",
    borderRadius: 14,
    height: 30,
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  valeur: {
    color: "#333",
    fontSize: 14,
  },
  preferences: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
    marginLeft: 10,
    textDecorationLine: "underline",
  },
  separateurGlobal: {
    height: 1,
    backgroundColor: "#888",
    marginBottom: 24,
    marginHorizontal: 20,
  },
  aucunEnfant: {
    fontSize: 15,
    color: "#333",
    marginTop: 6,
  },
  boutonAjout: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EDE7E7",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 6,
  },
  boutonAjoutTexte: {
    fontSize: 26,
    color: "#333",
    fontWeight: "500",
  },
});