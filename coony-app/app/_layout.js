import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Platform } from "react-native";

import { SessionParentProvider } from "../src/state/sessionParent";
import { EnfantSelectionneProvider } from "../src/state/enfantSelectionne";
import { QuestionnaireProvider } from "../src/state/questionnaireState";

export default function RootLayout() {
  const [dbPret, setDbPret] = useState(false);

  useEffect(() => {
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
        console.error("Database initialization error:", error); 
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
