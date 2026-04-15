import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

import { creerCompteParent, connecterParent } from "../data/repositories/parent.repo";
import { validateRequiredFields, validatePattern } from "../utils/validator";
import { creerProfilEnfant } from "../data/repositories/enfant.repo";

export const useInscription = (setParentConnecte) => {
  const [form, setForm] = useState({
    email: "",
    motDePasse: "",
    prenomEnfant: "",
    dateNaissance: "",
    responsableLegal: false,
    confidentialite: false,
  });
  
  const [chargement, setChargement] = useState(false);
  const router = useRouter();

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleInscription = async () => {
    const { email, motDePasse, prenomEnfant, dateNaissance, responsableLegal, confidentialite } = form;
    const emailNettoye = email.trim();
    const prenomNettoye = prenomEnfant.trim();
    const dateNettoyee = dateNaissance.trim();

    try {
      const required = validateRequiredFields(
        { emailNettoye, motDePasse, prenomNettoye, dateNettoyee },
        { messagePrefix: "Merci de remplir tous les champs obligatoires" }
      );

      if (!required.valid) {
        Alert.alert("Informations manquantes !", required.message);
        return;
      }

      if (!validatePattern(emailNettoye, "email")) {
        Alert.alert("Email invalide", "Merci d'entrer une adresse mail correcte.");
        return;
      }

      if (motDePasse.length < 6) {
        Alert.alert("Mot de passe trop court", "Utilise au moins 6 caractères");
        return;
      }

      if (!responsableLegal || !confidentialite) {
        Alert.alert("Validation requise", "Merci de confirmer les conditions d'utilisation");
        return;
      }

      const dateCheck = validatePattern(dateNettoyee, "dateISO", {
        message: "Utilise le format YYYY-MM-DD (ex: 2018-05-12)",
      });

      if (!dateCheck.valid) {
        Alert.alert("Date invalide", dateCheck.message);
        return;
      }

      setChargement(true);

      await creerCompteParent(emailNettoye, motDePasse);
      const parent = await connecterParent(emailNettoye, motDePasse);
      if (!parent) throw new Error("Erreur de connexion post-création.");

      await creerProfilEnfant(parent.id_parent, prenomNettoye, dateNettoyee);

      Alert.alert("Bienvenue !", "Votre compte COONY a été créé avec succès.");
      setParentConnecte(parent);
      router.replace("/tableau_de_bord_parent");

    } catch (error) {
        console.error("Erreur inscription :", error);
        if (error.message.includes("déjà utilisé")) {
          Alert.alert("Compte existant", "Cette adresse mail est déjà associée à un compte COONY.");
        } else {
          Alert.alert("Erreur", error?.message || "Une erreur est survenue.");
        }
      } finally {
        setChargement(false);
      }
    };

  return {
    form,
    updateField,
    handleInscription,
    chargement
  };
};
