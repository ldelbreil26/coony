import { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useSessionParent } from "../../src/state/sessionParent";
import { listerEnfantsDuParent, supprimerProfilEnfant } from "../../src/data/repositories/enfant.repo";

import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import COLORS from "../../src/utils/colors";
import FondOnde from "../../src/components/FondOnde";

export default function PageCompteParent() {
  const { parentConnecte } = useSessionParent();
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

  const confirmerSuppression = (enfant) => {
    Alert.alert(
      "Supprimer le profil",
      `Es-tu sûr de vouloir supprimer le profil de ${enfant.prenom} ? Cette action effacera aussi son historique.`,
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Supprimer", 
          style: "destructive", 
          onPress: () => handleSupprimer(enfant.id_enfant) 
        }
      ]
    );
  };

  const handleSupprimer = async (idEnfant) => {
    try {
      await supprimerProfilEnfant(idEnfant);
      await chargerEnfants();
      Alert.alert("Succès", "Le profil a été supprimé.");
    } catch (error) {
      Alert.alert("Erreur", "Impossible de supprimer l'enfant.");
    }
  };

  const gererDeconnexion = () => {
      Alert.alert(
        "Déconnexion",
        "Es-tu sûr de vouloir te déconnecter ?",
        [
          { text: "Annuler", style: "cancel" },
          { 
            text: "Se déconnecter", 
            style: "destructive", 
            onPress: () => {
              // Ici tu peux ajouter la logique pour vider ta session si nécessaire
              router.replace("/"); // Retour à l'écran de bienvenue (racine)
            } 
          }
        ]
      );
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
          
          <Text style={styles.titrePage}>Mon Compte</Text>

          <TouchableOpacity style={styles.boutonDeconnexionHeader} onPress={gererDeconnexion} >
            <MaterialCommunityIcons name="logout" size={22} color={COLORS.anger || "#FF5252"} />
          </TouchableOpacity>
        </View>

        {/* SECTION PARENT */}
        <View style={styles.carte}>
          <View style={styles.headerCarte}>
            <View style={styles.pastille}>
              <MaterialCommunityIcons name="shield-account" size={16} color={COLORS.textLight} />
              <Text style={styles.pastilleTexte}>INFOS PARENT</Text>            
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputFactice}>
              <Text style={styles.valeur}>{parentConnecte?.email || "Non connecté"}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Mot de passe</Text>
            <View style={styles.inputFactice}>
              <Text style={styles.valeur}>{motDePasseMasque}</Text>
              <MaterialCommunityIcons name="lock-outline" size={16} color={COLORS.textLight} />
            </View>
          </View>
        </View>

        <View style={styles.sectionDivider}>
            <Text style={styles.titreSection}>Mes enfants</Text>
            <View style={styles.ligneSeparateur} />
        </View>

        {/* LISTE DES ENFANTS */}
        {enfants.length === 0 ? (
          <View style={styles.carteVide}>
            <MaterialCommunityIcons name="account-search-outline" size={40} color={COLORS.textLight} />
            <Text style={styles.aucunEnfant}>Aucun enfant enregistré.</Text>
          </View>
        ) : (
          enfants.map((enfant, index) => (
            <View style={styles.carteEnfant} key={enfant.id_enfant}>
              <View style={styles.headerEnfant}>
                <View style={styles.profilMini}>
                   <MaterialCommunityIcons name="face-man-shimmer" size={24} color={COLORS.primary} />
                   <Text style={styles.nomEnfant}>{enfant.prenom}</Text>
                </View>
                
                <TouchableOpacity 
                  onPress={() => confirmerSuppression(enfant)}
                  style={styles.boutonSupprimer}
                >
                  <MaterialCommunityIcons name="trash-can-outline" size={22} color={COLORS.anger} />
                </TouchableOpacity>
              </View>

              <View style={styles.detailsEnfant}>
                <View style={styles.detailItem}>
                   <Text style={styles.detailLabel}>Né(e) le</Text>
                   <Text style={styles.detailValeur}>{enfant.date_naissance}</Text>
                </View>
                <View style={styles.verticalLine} />
                <View style={styles.detailItem}>
                   <Text style={styles.detailLabel}>Profil</Text>
                   <Text style={styles.detailValeur}>N° {index + 1}</Text>
                </View>
              </View>
            </View>
          ))
        )}

        {/* AJOUTER UN ENFANT */}
        <TouchableOpacity
          style={styles.boutonAjout}
          onPress={() => router.push("/ajout_enfant")}
        >
          <MaterialCommunityIcons name="plus-circle" size={24} color={COLORS.white} />
          <Text style={styles.boutonAjoutTexte}>Ajouter un enfant</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1 },
  container: { padding: 24, paddingTop: 60, paddingBottom: 40, flexGrow: 1 },
  
header: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", // Écarte les éléments aux extrémités
    marginBottom: 30 
  },
  
  boutonRetour: { 
    width: 45, 
    height: 45, 
    borderRadius: 15, 
    backgroundColor: COLORS.card, 
    justifyContent: "center", 
    alignItems: "center", 
    elevation: 3 
  },

  titrePage: { 
    fontSize: 20, // Légèrement réduit pour laisser de la place au bouton de droite
    fontWeight: "900", 
    color: COLORS.text,
    textAlign: "center",
    flex: 1, // Le titre prend tout l'espace central
  },

  boutonDeconnexionHeader: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: (COLORS.anger || "#FF5252") + '15', // Fond rouge très transparent (15 en hexa)
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: (COLORS.anger || "#FF5252") + '30', // Bordure légère
  },
  
  carte: { backgroundColor: COLORS.card, borderRadius: 25, padding: 20, marginBottom: 25, elevation: 4 },
  headerCarte: { marginBottom: 20 },
  pastille: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: COLORS.accent, alignSelf: "flex-start", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 },
  pastilleTexte: { fontWeight: "800", fontSize: 12, color: COLORS.textLight },

  infoRow: { marginBottom: 15 },
  label: { fontSize: 13, fontWeight: "700", color: COLORS.textLight, marginBottom: 6, marginLeft: 4 },
  inputFactice: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: COLORS.background, borderRadius: 15, height: 45, paddingHorizontal: 15 },
  valeur: { color: COLORS.text, fontSize: 15, fontWeight: "600" },

  sectionDivider: { flexDirection: "row", alignItems: "center", gap: 15, marginBottom: 20, marginTop: 10 },
  titreSection: { fontSize: 18, fontWeight: "800", color: COLORS.text },
  ligneSeparateur: { flex: 1, height: 1, backgroundColor: COLORS.accent },

  carteEnfant: { backgroundColor: COLORS.card, borderRadius: 25, padding: 20, marginBottom: 15, elevation: 3 },
  headerEnfant: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  profilMini: { flexDirection: "row", alignItems: "center", gap: 10 },
  nomEnfant: { fontSize: 18, fontWeight: "800", color: COLORS.primary },
  boutonSupprimer: { padding: 5 },

  detailsEnfant: { flexDirection: "row", backgroundColor: COLORS.background, borderRadius: 15, padding: 12 },
  detailItem: { flex: 1, alignItems: "center" },
  detailLabel: { fontSize: 11, color: COLORS.textLight, fontWeight: "600", textTransform: "uppercase" },
  detailValeur: { fontSize: 14, fontWeight: "700", color: COLORS.text },
  verticalLine: { width: 1, backgroundColor: COLORS.accent, height: "100%" },

  carteVide: { backgroundColor: COLORS.card, borderRadius: 25, padding: 30, alignItems: "center", marginBottom: 20, borderStyle: 'dashed', borderWidth: 2, borderColor: COLORS.accent },
  aucunEnfant: { marginTop: 10, fontSize: 14, color: COLORS.textLight, fontWeight: "600" },

  boutonAjout: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: COLORS.secondary, borderRadius: 20, paddingVertical: 16, marginTop: 10, elevation: 4 },
  boutonAjoutTexte: { fontSize: 16, fontWeight: "800", color: COLORS.white },

  boutonDeconnexion: {
    flexDirection: "row",
    alignItems: "right",
    justifyContent: "right",
    gap: 10,
    backgroundColor: 'transparent',
    borderRadius: 20,
    paddingVertical: 16,
    marginTop: 20,
    borderWidth: 1.5,
    borderColor: COLORS.anger || "#FF5252", // On utilise la couleur d'alerte
  },
});