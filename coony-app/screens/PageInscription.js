import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  ScrollView, 
  Switch,
  KeyboardAvoidingView,
  Platform 
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

import { creerCompteParent, connecterParent, creerProfilEnfant } from "../db/requetesMetier";
import { useSessionParent } from "../state/SessionParent";

import COLORS from "../utils/Colors";
import FondOnde from "../components/FondOnde";

export default function Inscription() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [prenomEnfant, setPrenomEnfant] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [responsableLegal, setResponsableLegal] = useState(false);
  const [confidentialite, setConfidentialite] = useState(false);
  const [chargement, setChargement] = useState(false);

  const { setParentConnecte } = useSessionParent();
  const router = useRouter();

  // --- LOGIQUE DE VALIDATION ---
  const validerEmail = (mail) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(mail);
  };

  const handleInscription = async () => {
    const emailNettoye = email.trim();
    const prenomNettoye = prenomEnfant.trim();
    const dateNettoyee = dateNaissance.trim();

    try {
      // 1. Vérification des champs vides
      if (!emailNettoye || !motDePasse || !prenomNettoye || !dateNettoyee) {
        Alert.alert("Informations manquantes !", "Merci de remplir tous les champs obligatoires.");
        return;
      }

      // 2. Vérification du format Email (REGEX)
      if (!validerEmail(emailNettoye)) {
        Alert.alert("Email invalide", "Merci d'entrer une adresse mail correcte (ex: nom@mail.com).");
        return;
      }

      // 3. Vérification de la sécurité du mot de passe
      if (motDePasse.length < 6) {
        Alert.alert("Mot de passe trop court", "Pour ta sécurité, utilise au moins 6 caractères.");
        return;
      }

      // 4. Vérification des cases à cocher
      if (!responsableLegal || !confidentialite) {
        Alert.alert("Validation requise", "Merci de confirmer les conditions d'utilisation.");
        return;
      }

      // 5. Vérification format Date
      const regexDate = /^\d{4}-\d{2}-\d{2}$/;
      if (!regexDate.test(dateNettoyee)) {
        Alert.alert("Date invalide", "Utilisez le format YYYY-MM-DD (ex: 2018-05-12).");
        return;
      }

      setChargement(true);

      // Création du compte
      await creerCompteParent(emailNettoye, motDePasse);
      
      // Connexion automatique
      const parent = await connecterParent(emailNettoye, motDePasse);

      if (!parent) throw new Error("Erreur de connexion post-création.");

      // Création du premier profil enfant
      await creerProfilEnfant(parent.id_parent, prenomNettoye, dateNettoyee);

      Alert.alert("Bienvenue !", "Votre compte COONY a été créé avec succès.");
      setParentConnecte(parent);
      router.replace("/tableau_de_bord_parent");

    } catch (error) {
        console.error("Erreur inscription :", error);
        
        // VERIFICATION DU MESSAGE D'ERREUR
        if (error.message.includes("déjà utilisé")) {
          Alert.alert(
            "Compte existant", 
            "Cette adresse mail est déjà associée à un compte COONY.!"
          );
        } else {
          Alert.alert("Erreur", error?.message || "Une erreur est survenue.");
        }
      } finally {
        setChargement(false);
      }
    };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={styles.mainWrapper}>
        <FondOnde />
        
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          
          <View style={styles.titreContainer}>
            <Text style={styles.titre}>CRÉATION DE COMPTE</Text>
          </View>

          {/* SECTION PARENT */}
          <View style={styles.carte}>
            <View style={styles.pastille}>
              <Text style={styles.pastilleTexte}>PARENT</Text>
            </View>

            <View style={styles.champGroup}>
              <Text style={styles.label}>Adresse Mail</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="exemple@mail.com"
                placeholderTextColor={COLORS.textLight}
              />
            </View>

            <View style={styles.champGroup}>
              <Text style={styles.label}>Mot de passe</Text>
              <TextInput
                style={styles.input}
                value={motDePasse}
                onChangeText={setMotDePasse}
                secureTextEntry
                placeholder="6 caractères minimum"
                placeholderTextColor={COLORS.textLight}
              />
            </View>
          </View>

          {/* SECTION ENFANT */}
          <View style={styles.carte}>
            <View style={styles.headerEnfant}>
              <View style={[styles.pastille, { backgroundColor: COLORS.accent }]}>
                <Text style={styles.pastilleTexte}>ENFANT</Text>
              </View>
              <View style={styles.numero}>
                <Text style={styles.numeroTexte}>1</Text>
              </View>
            </View>

            <View style={styles.champGroup}>
              <Text style={styles.label}>Prénom</Text>
              <TextInput
                style={styles.input}
                value={prenomEnfant}
                onChangeText={setPrenomEnfant}
                placeholder="Son prénom"
                placeholderTextColor={COLORS.textLight}
              />
            </View>

            <View style={styles.champGroup}>
              <Text style={styles.label}>Date de naissance</Text>
              <TextInput
                style={styles.input}
                value={dateNaissance}
                onChangeText={setDateNaissance}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={COLORS.textLight}
              />
            </View>

            <View style={styles.separateur} />

            <View style={styles.switchRow}>
              <Text style={styles.labelSwitch}>Je suis le responsable légal</Text>
              <Switch 
                value={responsableLegal} 
                onValueChange={setResponsableLegal}
                trackColor={{ false: "#D1D1D1", true: COLORS.secondary }}
                thumbColor={responsableLegal ? COLORS.primary : COLORS.secondary}
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.labelSwitch}>J'accepte la confidentialité</Text>
              <Switch 
                value={confidentialite} 
                onValueChange={setConfidentialite}
                trackColor={{ false: "#D1D1D1", true: COLORS.secondary }}
                thumbColor={confidentialite ? COLORS.primary : COLORS.secondary}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.boutonAction, chargement && { opacity: 0.7 }]}
            onPress={handleInscription}
            disabled={chargement}
          >
            <Text style={styles.boutonActionTexte}>
              {chargement ? "CRÉATION EN COURS..." : "CRÉER MON COMPTE"}
            </Text>
          </TouchableOpacity>

        </ScrollView>

        <TouchableOpacity style={styles.boutonRetour} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={COLORS.text} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1 },
  container: { paddingHorizontal: 24, paddingTop: 100, paddingBottom: 40, flexGrow: 1 },
  titreContainer: { alignItems: "center", marginBottom: 30 },
  titre: { fontSize: 22, fontWeight: "900", color: COLORS.primary, letterSpacing: 1.2 },
  carte: { 
    backgroundColor: COLORS.card, 
    borderRadius: 28, 
    padding: 22, 
    marginBottom: 24, 
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  pastille: { backgroundColor: COLORS.background, alignSelf: "flex-start", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 6, marginBottom: 20 },
  pastilleTexte: { fontWeight: "800", fontSize: 13, color: COLORS.text },
  headerEnfant: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  numero: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.accent, alignItems: "center", justifyContent: "center" },
  numeroTexte: { fontWeight: "900", color: COLORS.text },
  champGroup: { marginBottom: 18 },
  label: { fontSize: 14, color: COLORS.textLight, fontWeight: "700", marginBottom: 8, marginLeft: 4 },
  input: { backgroundColor: COLORS.background, borderRadius: 16, height: 50, paddingHorizontal: 16, color: COLORS.text, borderWidth: 1, borderColor: COLORS.accent },
  separateur: { height: 1, backgroundColor: COLORS.accent, marginVertical: 20, opacity: 0.5 },
  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  labelSwitch: { fontSize: 14, color: COLORS.text, fontWeight: "600", flex: 1 },
  boutonAction: { backgroundColor: COLORS.primary, borderRadius: 25, paddingVertical: 18, alignItems: "center", marginTop: 10, elevation: 5 },
  boutonActionTexte: { fontSize: 16, fontWeight: "800", color: COLORS.white },
  boutonRetour: { position: "absolute", top: 50, left: 20, width: 46, height: 46, borderRadius: 23, backgroundColor: COLORS.card, justifyContent: "center", alignItems: "center", elevation: 6 }
});