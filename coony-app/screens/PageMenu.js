import { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useSessionParent } from "../state/SessionParent";
import { useEnfantSelectionne } from "../state/EnfantSelectionne";
import { listerEnfantsDuParent } from "../db/requetesMetier";

import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import COLORS from "../utils/Colors";
import FondOnde from "../components/FondOnde";

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
    <View style={styles.mainWrapper}>
      <FondOnde />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.boutonRetour} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.titrePage}>Choisir un espace</Text>
        </View>

        {/* SECTION PARENT */}
        <Text style={styles.sectionTitre}>Espace Parent</Text>
        <TouchableOpacity style={styles.carteParent} onPress={allerDashboardParent}>
          <View style={styles.iconCercleParent}>
            <MaterialCommunityIcons name="shield-account" size={40} color={COLORS.white} />
          </View>
          <View style={styles.infoCarte}>
            <Text style={styles.texteCarteTitre}>TABLEAU DE BORD</Text>
            <Text style={styles.texteCarteSub}>Gérer les profils et voir le suivi</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={28} color={COLORS.texte} />
        </TouchableOpacity>

        {/* SECTION ENFANTS */}
        <View style={styles.sectionHeaderEnfants}>
          <Text style={styles.sectionTitre}>Espaces Enfants</Text>
          <View style={styles.badgeCompteur}>
            <Text style={styles.badgeTexte}>{enfants.length}</Text>
          </View>
        </View>

        {enfants.length === 0 ? (
          <TouchableOpacity style={styles.carteVide} onPress={() => router.push("/ajout_enfant")}>
            <MaterialCommunityIcons name="account-plus-outline" size={32} color={COLORS.textLight} />
            <Text style={styles.texteCarteVide}>Ajouter un premier enfant pour commencer</Text>
          </TouchableOpacity>
        ) : (
          enfants.map((enfant, index) => (
            <TouchableOpacity
              key={enfant.id_enfant}
              style={styles.carteEnfant}
              onPress={() => allerDashboardEnfant(enfant)}
            >
              <View style={[styles.iconCercleEnfant, { backgroundColor: COLORS.joy}]}>
                <MaterialCommunityIcons name="face-recognition" size={35} color={COLORS.white} />
              </View>
              <View style={styles.infoCarte}>
                <Text style={styles.texteEnfantNom}>{enfant.prenom?.toUpperCase()}</Text>
                <Text style={styles.texteEnfantAction}>Ouvrir l'espace ludique</Text>
              </View>
              <MaterialCommunityIcons name="arrow-right-circle" size={32} color={COLORS.accent} />
            </TouchableOpacity>
          ))
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1 },
  container: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  
  header: { flexDirection: "row", alignItems: "center", marginBottom: 40 },
  boutonRetour: { width: 45, height: 45, borderRadius: 15, backgroundColor: COLORS.card, justifyContent: "center", alignItems: "center", elevation: 4 },
  titrePage: { fontSize: 22, fontWeight: "900", color: COLORS.text, marginLeft: 20 },

  sectionTitre: { fontSize: 16, fontWeight: "800", color: COLORS.textLight, textTransform: "uppercase", letterSpacing: 1, marginBottom: 15, marginLeft: 5 },
  
  carteParent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 25,
    padding: 20,
    marginBottom: 40,
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderLeftWidth: 6,
    borderLeftColor: COLORS.primary,
  },
  iconCercleParent: { width: 65, height: 65, borderRadius: 20, backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center" },
  
  infoCarte: { flex: 1, marginLeft: 15 },
  texteCarteTitre: { fontSize: 18, fontWeight: "900", color: COLORS.text },
  texteCarteSub: { fontSize: 13, color: COLORS.textLight, marginTop: 2 },

  sectionHeaderEnfants: { flexDirection: "row", alignItems: "center", marginBottom: 15, gap: 10 },
  badgeCompteur: { backgroundColor: COLORS.accent, paddingHorizontal: 10, paddingVertical: 2, borderRadius: 10, marginBottom: 12 },
  badgeTexte: { fontWeight: "900", color: COLORS.primary, fontSize: 12 },

  carteEnfant: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
    elevation: 4,
  },
  iconCercleEnfant: { width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center" },
  texteEnfantNom: { fontSize: 18, fontWeight: "900", color: COLORS.text },
  texteEnfantAction: { fontSize: 12, color: COLORS.secondary, fontWeight: "700" },

  carteVide: {
    padding: 30,
    backgroundColor: COLORS.card,
    borderRadius: 25,
    alignItems: "center",
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  texteCarteVide: { textAlign: "center", marginTop: 10, color: COLORS.textLight, fontWeight: "600" }
});