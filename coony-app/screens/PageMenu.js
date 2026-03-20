import { useCallback, useState } from "react";
import { View, Text, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, StyleSheet, ScrollView, Switch } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useSessionParent } from "../state/SessionParent";
import { useEnfantSelectionne } from "../state/EnfantSelectionne";
import { listerEnfantsDuParent } from "../db/requetesMetier";

import Ionicons from '@expo/vector-icons/Ionicons';

export default function Menu() {
  const { parentConnecte } = useSessionParent();
  const { setEnfantSelectionne } = useEnfantSelectionne();

  const [enfants, setEnfants] = useState([]);

  const chargerEnfants = async () => {
    try {
      if (!parentConnecte?.id_parent) return;

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

  const allerDashboardParent = () => {
    router.push("/tableau_de_bord_parent");
  };

  const allerDashboardEnfant = (enfant) => {
    setEnfantSelectionne(enfant);
    router.push("/tableau_de_bord_enfant");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.boutonRetour} onPress={() => router.back()}>
        <Ionicons name="return-up-back-outline" size={24} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.carte} onPress={allerDashboardParent}>
        <Text style={styles.texteCarte}>DASHBOARD{"\n"}PARENT</Text>
      </TouchableOpacity>

      {enfants.length === 0 ? (
        <View style={styles.carte}>
          <Text style={styles.texteCarte}>AUCUN{"\n"}ENFANT</Text>
        </View>
      ) : (
        enfants.map((enfant, index) => (
          <TouchableOpacity
            key={enfant.id_enfant}
            style={styles.carte}
            onPress={() => allerDashboardEnfant(enfant)}
          >
            <Text style={styles.texteCarte}>
              DASHBOARD{"\n"}
              {enfant.prenom ? enfant.prenom.toUpperCase() : `ENFANT ${index + 1}`}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F4F4F4",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: "center",
  },
  boutonRetour: {
    alignSelf: "flex-start",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#EDE7E7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,

    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  boutonRetourTexte: {
    fontSize: 22,
    color: "#333",
    fontWeight: "600",
  },
  carte: {
    width: "100%",
    minHeight: 160,
    backgroundColor: "#D9D9D9",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 34,

    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  texteCarte: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    lineHeight: 42,
  },
});