/**
 * @file _layout.js
 * @description Mise en page racine de l'application.
 * Ce fichier orchestre la configuration initiale de l'application, y compris l'initialisation de la base de données
 * et la gestion de l'état global via les Providers de React Context.
 * 
 * Architecture :
 * - Base de données : Initialise SQLite sur les plateformes mobiles et insère les données initiales (catalogues, utilisateurs).
 * - Gestion de l'état : Enveloppe l'ensemble de l'application dans plusieurs providers (SessionParent, EnfantSelectionne, Questionnaire)
 *   pour assurer la disponibilité de l'état sur toutes les routes.
 * - Routage : Utilise Stack d'Expo Router pour gérer le flux de navigation.
 */

import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Platform } from "react-native";

import { SessionParentProvider } from "../src/state/sessionParent";
import { EnfantSelectionneProvider } from "../src/state/enfantSelectionne";
import { QuestionnaireProvider } from "../src/state/questionnaireState";

/**
 * Composant racine qui initialise l'environnement de l'application et fournit le contexte global.
 * 
 * @returns {JSX.Element} L'arborescence de l'application enveloppée dans les providers globaux.
 */
export default function RootLayout() {
  const [dbPret, setDbPret] = useState(false);

  useEffect(() => {
    /**
     * Fonction asynchrone interne pour gérer la configuration et le seeding de la base de données.
     * Empêche l'application de rendre son contenu principal tant que la couche de données n'est pas prête.
     */
    async function init() {
      try {
        if (Platform.OS === "web") { 
          setDbPret(true); 
          return; 
        }

        const { initialiserBaseDeDonnees } = await import("../src/data/sqlite/client");
        
        const { seedCatalogues } = await import("../src/data/seed/catalogues.seed");
        const { seedUsers } = await import("../src/data/seed/users.seed");

        await initialiserBaseDeDonnees();
        await seedCatalogues();
        await seedUsers();

        setDbPret(true);
      } catch (error) { 
        console.error("Erreur d'initialisation de la base de données :", error); 
      }
    }
    init();
  }, []);

  if (!dbPret) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Chargement de l'application...</Text>
      </View>
    );
  }

  return (
    <SessionParentProvider>
      <EnfantSelectionneProvider>
        <QuestionnaireProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </QuestionnaireProvider>
      </EnfantSelectionneProvider>
    </SessionParentProvider>
  );
}
