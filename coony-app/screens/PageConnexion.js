import { useState } from "react";
import { View, Text, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, StyleSheet, ScrollView, Switch } from "react-native";
import { router } from "expo-router";
import { connecterParent } from "../db/requetesMetier";
import { useSessionParent } from "../state/SessionParent";
import { useRouter } from "expo-router";

import Ionicons from '@expo/vector-icons/Ionicons';

export default function Connexion() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [chargement, setChargement] = useState(false);

  const { setParentConnecte } = useSessionParent();

  const router = useRouter();

  const handleConnexion = async () => {
    try {
      if (!email || !motDePasse) {
        Alert.alert("Champs manquants", "Merci de remplir l’identifiant et le mot de passe.");
        return;
      }

      setChargement(true);

      const parent = await connecterParent(email.trim(), motDePasse);

      if (!parent) {
        Alert.alert("Connexion impossible", "Identifiant ou mot de passe incorrect.");
        return;
      }

      Alert.alert("Connexion réussie", "Bienvenue sur COONY.");
      setParentConnecte(parent);
      router.replace("/dashboard_parent");

    } catch (error) {
      console.error("Erreur connexion :", error);
      Alert.alert(
        "Erreur",
        error?.message || "Une erreur est survenue lors de la connexion."
      );
    } finally {
      setChargement(false);
    }
  };

  const handleMotDePasseOublie = () => {
    Alert.alert(
      "Fonction non disponible",
      "La récupération de mot de passe n’est pas encore implémentée."
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.titreContainer}>
        <Text style={styles.titre}>PAGE DE CONNEXION</Text>
      </View>

      <View style={styles.carte}>
        <View style={styles.ligneChamp}>
          <Text style={styles.label}>Identifiant :</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder=""
          />
        </View>

        <View style={styles.ligneChamp}>
          <Text style={styles.label}>Mot de passe :</Text>
          <TextInput
            style={styles.input}
            value={motDePasse}
            onChangeText={setMotDePasse}
            secureTextEntry
            placeholder=""
          />
        </View>
      </View>

      <TouchableOpacity onPress={handleMotDePasseOublie}>
        <Text style={styles.mdpOublie}>Mot de passe oublié ?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.bouton}
        onPress={handleConnexion}
        disabled={chargement}
      >
        <Text style={styles.boutonTexte}>
          {chargement ? "Connexion..." : "Connexion"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.boutonRetour}
        onPress={() => router.back()}
      >
        <Ionicons name="return-up-back-outline" size={24} color="#333" />
      </TouchableOpacity>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    paddingHorizontal: 28,
    paddingTop: 110,
  },
  titreContainer: {
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 180,
  },
  titre: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  carte: {
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 28,
    marginBottom: 26,
  },
  ligneChamp: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },
  label: {
    width: 135,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    flex: 1,
    height: 32,
    backgroundColor: "#F3F3F3",
    borderRadius: 16,
    paddingHorizontal: 12,
  },
  mdpOublie: {
    fontSize: 15,
    color: "#333",
    marginLeft: 20,
    marginBottom: 90,
  },
  bouton: {
    alignSelf: "center",
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    paddingHorizontal: 48,
    paddingVertical: 14,
  },
  boutonTexte: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },

  boutonRetour: {
    position: "absolute",
    bottom: 30,
    left: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E5E5E5",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },

  texteRetour: {
    fontSize: 22,
  },

});