/**
 * @file useConnexion.js
 * @description Hook personnalisé pour gérer l'authentification des parents.
 * 
 * Architecture :
 * - Interaction : Communique avec `parent.repo` pour vérifier les identifiants.
 * - Mise à jour de l'état : En cas de succès, met à jour le `SessionParentContext` global via `useSessionParent`.
 * - Navigation : Redirige l'utilisateur vers le tableau de bord parent après une connexion réussie via Expo Router.
 */

import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { connecterParent } from "../../data/repositories/parent.repo";
import { validateRequiredFields } from "../../utils/validator";
import { useSessionParent } from "../../state/sessionParent";

/**
 * Hook pour gérer l'état du formulaire de connexion et la logique d'authentification.
 * 
 * @returns {Object} {
 *   email: string,
 *   setEmail: Function,
 *   motDePasse: string,
 *   setMotDePasse: Function,
 *   chargement: boolean,
 *   handleConnexion: Function,
 *   handleMotDePasseOublie: Function
 * }
 */
export function useConnexionParent() {
  const router = useRouter(); 

  const { setParentConnecte } = useSessionParent();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [chargement, setChargement] = useState(false);

  /**
   * Valide les entrées, appelle le repository pour l'authentification,
   * et met à jour l'état de la session globale en cas de succès.
   */
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

      // Mise à jour de l'état de la session globale
      setParentConnecte(parent);

      // Navigation vers l'écran suivant
      router.replace("/tableau_de_bord_parent");
    } catch (error) {
      console.error("Erreur connexion :", error);
      Alert.alert("Erreur", "Une erreur est survenue lors de la connexion.");
    } finally {
      setChargement(false);
    }
  };

  /**
   * Espace réservé pour la logique de récupération de mot de passe.
   */
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