import { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { creerProfilEnfant } from "../data/repositories/enfant.repo";
import { validateRequiredFields, validatePattern } from "../utils/validator";
import { useSessionParent } from "../state/sessionParent";

/**
 * Hook gérant la logique d'ajout d'un profil enfant.
 *
 * Valide les champs saisis, crée le profil en base via le repository,
 * puis redirige vers le compte parent en cas de succès.
 *
 * @returns {Object} L'état et les handlers du formulaire.
 * @returns {string}   .prenom            - Prénom saisi.
 * @returns {Function} .setPrenom         - Met à jour le prénom.
 * @returns {string}   .dateNaissance     - Date de naissance saisie (format AAAA-MM-JJ).
 * @returns {Function} .setDateNaissance  - Met à jour la date de naissance.
 * @returns {boolean}  .chargement        - Indique si la création est en cours.
 * @returns {Function} .handleAjoutEnfant - Déclenche la validation et la création du profil.
 */
export function useAjoutEnfant() {
  const { parentConnecte } = useSessionParent();
  const [prenom, setPrenom] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [chargement, setChargement] = useState(false);

  const handleAjoutEnfant = async () => {
    const required = validateRequiredFields(prenom, dateNaissance, {
      message: "Merci de remplir tous les champs",
    });

    if (!required.valid) {
      Alert.alert("Champs manquants", required.message);
      return;
    }

    const dateCheck = validatePattern(dateNaissance, "dateISO", {
      message: "Format requis : AAAA-MM-JJ (ex: 2015-05-12)",
    });

    if (!dateCheck.valid) {
      Alert.alert("Date invalide", dateCheck.message);
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

  return {
    prenom,
    setPrenom,
    dateNaissance,
    setDateNaissance,
    chargement,
    handleAjoutEnfant,
  };
}