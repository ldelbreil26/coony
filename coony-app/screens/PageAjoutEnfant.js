import { useState } from "react";
// AJOUT de Alert dans l'import ci-dessous
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import { router } from "expo-router";
import { creerProfilEnfant } from "../db/requetesMetier";
import { useSessionParent } from "../state/SessionParent";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function PageAjoutEnfant() {
  const { parentConnecte } = useSessionParent();
  const [prenom, setPrenom] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [chargement, setChargement] = useState(false);

  const handleAjoutEnfant = async () => {
    if (!prenom || !dateNaissance) {
      Alert.alert("Champs manquants", "Merci de remplir tous les champs.");
      return;
    }

    const regexDate = /^\d{4}-\d{2}-\d{2}$/;
    if (!regexDate.test(dateNaissance)) {
      Alert.alert("Date invalide", "Format requis : YYYY-MM-DD.");
      return;
    }

    try {
      setChargement(true);
      await creerProfilEnfant(
        parentConnecte.id_parent,
        prenom.trim(),
        dateNaissance.trim()
      );

      // Message de succès
      Alert.alert("Succès", "Le profil de " + prenom + " a été créé !");
      
      // Retour automatique vers le compte parent
      router.replace("/compte_parent"); 
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'ajouter l'enfant.");
    } finally {
      setChargement(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.boutonRetour} onPress={() => router.back()}>
        <Ionicons name="return-up-back-outline" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.titreContainer}>
        <Text style={styles.titre}>AJOUT D’UN ENFANT</Text>
      </View>

      <View style={styles.carte}>
        <View style={styles.pastille}>
          <Text style={styles.pastilleTexte}>ENFANT</Text>
        </View>

        <View style={styles.ligneChamp}>
          <Text style={styles.label}>Prénom :</Text>
          <TextInput
            style={styles.input}
            value={prenom}
            onChangeText={setPrenom}
            placeholder="Ex: Lucas"
          />
        </View>

        <View style={styles.ligneChamp}>
          <Text style={styles.label}>Date de naissance :</Text>
          <TextInput
            style={styles.input}
            value={dateNaissance}
            onChangeText={setDateNaissance}
            placeholder="YYYY-MM-DD"
            keyboardType="numeric"
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.bouton, chargement && { opacity: 0.7 }]}
        onPress={handleAjoutEnfant}
        disabled={chargement}
      >
        <Text style={styles.boutonTexte}>
          {chargement ? "Création..." : "Ajouter"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    paddingHorizontal: 24,
    paddingTop: 60,
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
  titreContainer: {
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 30,
  },
  titre: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  carte: {
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    padding: 18,
    marginBottom: 30,
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
  ligneChamp: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  label: {
    width: 130,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  input: {
    flex: 1,
    height: 34,
    backgroundColor: "#F3F3F3",
    borderRadius: 16,
    paddingHorizontal: 12,
  },
  bouton: {
    alignSelf: "center",
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    paddingHorizontal: 36,
    paddingVertical: 14,
  },
  boutonTexte: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
});