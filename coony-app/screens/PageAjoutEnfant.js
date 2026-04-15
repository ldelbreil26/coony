import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { creerProfilEnfant } from "../db/requetesMetier";
import { useSessionParent } from "../state/SessionParent";

import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import COLORS from "../utils/Colors";
import FondOnde from "../components/FondOnde";

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
      Alert.alert("Date invalide", "Format requis : AAAA-MM-JJ (ex: 2015-05-12).");
      return;
    }

    try {
      setChargement(true);
      await creerProfilEnfant(
        parentConnecte.id_parent,
        prenom.trim(),
        dateNaissance.trim()
      );

      Alert.alert("Bienvenue !", `Le profil de ${prenom} a été créé.`);
      router.replace("/compte_parent"); 
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'ajouter l'enfant.");
    } finally {
      setChargement(false);
    }
  };

  return (
    <View style={styles.mainWrapper}>
      <FondOnde />

      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.boutonRetour} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.titrePage}>Nouvel Enfant</Text>
        </View>

        {/* CARTE FORMULAIRE */}
        <View style={styles.carte}>
          <View style={styles.pastille}>
            <MaterialCommunityIcons name="baby-face-outline" size={18} color={COLORS.primary} />
            <Text style={styles.pastilleTexte}>PROFIL</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Prénom</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="account-edit-outline" size={20} color={COLORS.textLight} />
              <TextInput
                style={styles.input}
                value={prenom}
                onChangeText={setPrenom}
                placeholder="Ex: Lucas"
                placeholderTextColor={COLORS.textLight + '80'}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Date de naissance</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="calendar-range" size={20} color={COLORS.textLight} />
              <TextInput
                style={styles.input}
                value={dateNaissance}
                onChangeText={setDateNaissance}
                placeholder="AAAA-MM-JJ"
                placeholderTextColor={COLORS.textLight + '80'}
              />
            </View>
            <Text style={styles.aideSaisie}>Format : Année-Mois-Jour (ex: 2018-04-25)</Text>
          </View>
        </View>

        {/* BOUTON ACTION */}
        <TouchableOpacity
          style={[styles.boutonValider, chargement && styles.boutonDesactive]}
          onPress={handleAjoutEnfant}
          disabled={chargement}
        >
          {chargement ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <Text style={styles.boutonTexte}>CRÉER LE PROFIL</Text>
              <MaterialCommunityIcons name="check-circle" size={22} color={COLORS.white} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 60 },
  
  header: { flexDirection: "row", alignItems: "center", marginBottom: 35 },
  boutonRetour: { width: 45, height: 45, borderRadius: 15, backgroundColor: COLORS.card, justifyContent: "center", alignItems: "center", elevation: 4 },
  titrePage: { fontSize: 22, fontWeight: "900", color: COLORS.text, marginLeft: 20 },

  carte: { backgroundColor: COLORS.card, borderRadius: 30, padding: 25, elevation: 6, shadowColor: COLORS.shadow, shadowOpacity: 0.1, shadowRadius: 10, marginBottom: 30 },
  pastille: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: COLORS.accent, alignSelf: "flex-start", borderRadius: 12, paddingHorizontal: 15, paddingVertical: 8, marginBottom: 25 },
  pastilleTexte: { fontWeight: "800", fontSize: 13, color: COLORS.primary, letterSpacing: 1 },

  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "700", color: COLORS.text, marginBottom: 8, marginLeft: 4 },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.background, borderRadius: 18, paddingHorizontal: 15, height: 55, borderWidth: 1, borderColor: COLORS.accent },
  input: { flex: 1, marginLeft: 10, fontSize: 16, color: COLORS.text, fontWeight: "600" },
  
  aideSaisie: { fontSize: 11, color: COLORS.textLight, marginTop: 6, marginLeft: 10, fontStyle: "italic" },

  boutonValider: { 
    flexDirection: "row", 
    backgroundColor: COLORS.primary, 
    borderRadius: 22, 
    height: 60, 
    justifyContent: "center", 
    alignItems: "center", 
    gap: 12, 
    elevation: 5,
    marginTop: 10,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 }
  },
  boutonDesactive: { opacity: 0.6 },
  boutonTexte: { fontSize: 16, fontWeight: "900", color: COLORS.white, letterSpacing: 1 },
});