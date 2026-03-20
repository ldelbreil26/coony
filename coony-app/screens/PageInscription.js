import { useState } from "react";
import { View, Text, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, StyleSheet, ScrollView, Switch } from "react-native";
import { router } from "expo-router";
import { creerCompteParent, connecterParent, creerProfilEnfant } from "../db/requetesMetier";
import { useSessionParent } from "../state/SessionParent";
import { useRouter } from "expo-router";

import Ionicons from '@expo/vector-icons/Ionicons';

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

  const handleInscription = async () => {
    try {
      if (!email || !motDePasse || !prenomEnfant || !dateNaissance) {
        Alert.alert(
          "Informations manquantes !",
          "Merci de remplir tous les champs obligatoires."
        );
        return;
      }

      if (!responsableLegal || !confidentialite) {
        Alert.alert(
          "Validation requise",
          "Merci de confirmer que vous êtes le responsable légal et d’accepter la politique de confidentialité."
        );
        return;
      }

      const regexDate = /^\d{4}-\d{2}-\d{2}$/;
      if (!regexDate.test(dateNaissance)) {
        Alert.alert(
          "Date invalide",
          "La date de naissance doit être au format YYYY-MM-DD."
        );
        return;
      }

      setChargement(true);

      await creerCompteParent(email.trim(), motDePasse);
      const parent = await connecterParent(email.trim(), motDePasse);

      if (!parent) {
        throw new Error("Impossible de connecter le parent après création.");
      }

      await creerProfilEnfant(
        parent.id_parent,
        prenomEnfant.trim(),
        dateNaissance.trim()
      );

      Alert.alert("Compte créé", "Le compte a bien été créé.");
      setParentConnecte(parent);
      router.replace("/tableau_de_bord_parent");


    } catch (error) {
      console.error("Erreur inscription :", error);

      if (String(error?.message || error).includes("UNIQUE constraint failed")) {
        Alert.alert(
          "Compte existant",
          "Un compte avec cette adresse mail existe déjà."
        );
      } else {
        Alert.alert(
          "Erreur",
          error?.message || "Une erreur est survenue lors de l’inscription."
        );
      }
    } finally {
      setChargement(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titreContainer}>
        <Text style={styles.titre}>CRÉATION DE COMPTE</Text>
      </View>

      <View style={styles.carte}>
        <View style={styles.pastille}>
          <Text style={styles.pastilleTexte}>PARENT</Text>
        </View>

        <View style={styles.ligneChamp}>
          <Text style={styles.label}>Mail :</Text>
          <TextInput
            style={styles.inputLong}
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
            style={styles.inputLong}
            value={motDePasse}
            onChangeText={setMotDePasse}
            secureTextEntry
            placeholder=""
          />
        </View>
      </View>

      <View style={styles.carte}>
        <View style={styles.headerEnfant}>
          <View style={styles.pastille}>
            <Text style={styles.pastilleTexte}>ENFANT</Text>
          </View>
          <View style={styles.numero}>
            <Text style={styles.numeroTexte}>1</Text>
          </View>
        </View>

        <View style={styles.ligneChamp}>
          <Text style={styles.label}>Prénom :</Text>
          <TextInput
            style={styles.inputPetit}
            value={prenomEnfant}
            onChangeText={setPrenomEnfant}
            placeholder=""
          />
        </View>

        <View style={styles.ligneChamp}>
          <Text style={styles.label}>Date de naissance :</Text>
          <TextInput
            style={styles.inputDate}
            value={dateNaissance}
            onChangeText={setDateNaissance}
            placeholder="YYYY-MM-DD"
          />
        </View>

        <View style={styles.separateur} />

        <View style={styles.ligneCheckbox}>
          <Text style={styles.labelCheckbox}>
            Je confirme être le responsable légal
          </Text>
          <Switch value={responsableLegal} onValueChange={setResponsableLegal} />
        </View>

        <View style={styles.ligneCheckbox}>
          <Text style={styles.labelCheckbox}>
            J’accepte la politique de confidentialité
          </Text>
          <Switch value={confidentialite} onValueChange={setConfidentialite} />
        </View>
      </View>

      <TouchableOpacity
        style={styles.bouton}
        onPress={handleInscription}
        disabled={chargement}
      >
        <Text style={styles.boutonTexte}>
          {chargement ? "Création..." : "Créer"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.boutonRetour}
        onPress={() => router.back()}
      >
        <Ionicons name="return-up-back-outline" size={24} color="#333" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#F4F4F4",
    flexGrow: 1,
  },
  titreContainer: {
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 28,
    marginTop: 30,
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
    paddingHorizontal: 10,
  },
  inputLong: {
    backgroundColor: "#F3F3F3",
    borderRadius: 14,
    height: 30,
    flex: 1,
    paddingHorizontal: 10,
  },
  inputDate: {
    backgroundColor: "#F3F3F3",
    borderRadius: 14,
    height: 30,
    flex: 1,
    paddingHorizontal: 10,
  },
  separateur: {
    height: 1,
    backgroundColor: "#EFEFEF",
    marginVertical: 16,
    marginHorizontal: 30,
  },
  ligneCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    gap: 12,
  },
  labelCheckbox: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  bouton: {
    alignSelf: "center",
    backgroundColor: "#E8E4E4",
    borderRadius: 18,
    paddingHorizontal: 34,
    paddingVertical: 12,
    marginTop: 8,
    marginBottom: 30,
  },
  boutonTexte: {
    fontSize: 18,
    fontWeight: "600",
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
  }
});