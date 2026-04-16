import { useState, useCallback } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { useFocusEffect } from "expo-router";
import { listerEnfantsDuParent, supprimerProfilEnfant } from "../data/repositories/enfant.repo";
import { useSessionParent } from "../state/sessionParent";

export function useCompteParent() {
  const { parentConnecte } = useSessionParent();
  const [enfants, setEnfants] = useState([]);

  const chargerEnfants = useCallback(async () => {
    if (!parentConnecte?.id_parent) return;
    try {
      const resultat = await listerEnfantsDuParent(parentConnecte.id_parent);
      setEnfants(resultat);
    } catch (error) {
      console.error("Erreur chargement enfants :", error);
    }
  }, [parentConnecte]);

  useFocusEffect(
    useCallback(() => {
      chargerEnfants();
    }, [chargerEnfants])
  );

  const handleSupprimer = async (idEnfant) => {
    try {
      await supprimerProfilEnfant(idEnfant);
      await chargerEnfants();
      Alert.alert("Succès", "Le profil a été supprimé.");
    } catch (error) {
      Alert.alert("Erreur", "Impossible de supprimer l'enfant.");
    }
  };

  const confirmerSuppression = (enfant) => {
    Alert.alert(
      "Supprimer le profil",
      `Es-tu sûr de vouloir supprimer le profil de ${enfant.prenom} ? Cette action effacera aussi son historique.`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => handleSupprimer(enfant.id_enfant),
        },
      ]
    );
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
          onPress: () => router.replace("/"),
        },
      ]
    );
  };

  return {
    parentConnecte,
    enfants,
    motDePasseMasque: "••••••••",
    confirmerSuppression,
    gererDeconnexion,
  };
}