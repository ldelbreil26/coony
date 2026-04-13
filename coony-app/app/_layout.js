import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Platform } from "react-native";
import { SessionParentProvider } from "../state/SessionParent";
import { EnfantSelectionneProvider } from "../state/EnfantSelectionne";
import { QuestionnaireProvider } from "../state/QuestionnaireState";

export default function RootLayout() {
  const [dbPret, setDbPret] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        if (Platform.OS === "web") { setDbPret(true); return; }
        const { initialiserBaseDeDonnees } = await import("../db/baseDeDonnees");
        const { seedCatalogues } = await import("../db/seed");

        await initialiserBaseDeDonnees();
        await seedCatalogues();
        setDbPret(true);
      } catch (error) { console.error(error); }
    }
    init();
  }, []);

  if (!dbPret) return <View style={{flex:1, justifyContent:'center'}}><Text>Chargement...</Text></View>;

  return (
    <SessionParentProvider>
      <EnfantSelectionneProvider>
        <QuestionnaireProvider>
          {/* Le Stack ici gère les grands groupes */}
          <Stack screenOptions={{ headerShown: false }} />
        </QuestionnaireProvider>
      </EnfantSelectionneProvider>
    </SessionParentProvider>
  );
}