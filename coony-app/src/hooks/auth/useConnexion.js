import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { connecterParent } from "../../data/repositories/parent.repo";
import { validateRequiredFields } from "../../utils/validator";
import { useSessionParent } from "../../state/sessionParent";

export function useConnexionParent() {
  const router = useRouter(); 

  const { setParentConnecte } = useSessionParent();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [chargement, setChargement] = useState(false);

  const handleConnexion = async () => {
    try {
      const required = validateRequiredFields(
        { email, motDePasse },
        { message: "Merci de remplir l'identifiant et le mot de passe" }
      );

      if (!required.valid) {
        Alert.alert("Champs manquants", required.message);
        return;
      }

      setChargement(true);
      const parent = await connecterParent(email.trim(), motDePasse);

      if (!parent) {
        Alert.alert(
          "Connexion impossible",
          "Identifiant ou mot de passe incorrect."
        );
        return;
      }

      setParentConnecte(parent);
      router.replace("/tableau_de_bord_parent");
    } catch (error) {
      console.error("Erreur connexion :", error);
      Alert.alert("Erreur", "Une erreur est survenue lors de la connexion.");
    } finally {
      setChargement(false);
    }
  };

  const handleMotDePasseOublie = () => {
    Alert.alert(
      "Fonction non disponible",
      "La récupération de mot de passe n'est pas encore implémentée."
    );
  };

  return {
    email,
    setEmail,
    motDePasse,
    setMotDePasse,
    chargement,
    handleConnexion,
    handleMotDePasseOublie,
  };
}