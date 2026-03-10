import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Platform } from "react-native";
import { SessionParentProvider } from "../state/SessionParent";

export default function RootLayout() {
  const [dbPret, setDbPret] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        if (Platform.OS === "web") {
          setDbPret(true);
          return;
        }

        const { initialiserBaseDeDonnees } = await import("../db/baseDeDonnees");
        const { listerTables } = await import("../db/requetes");
        const { seedCatalogues } = await import("../db/seed");

        console.log("Initialisation de la base de données");
        await initialiserBaseDeDonnees();
        console.log("Base de données prête");

        const tables = await listerTables();
        console.log("Tables présentes :", tables);

        await seedCatalogues();
        console.log("Seed terminé");

        setDbPret(true);
      } catch (error) {
        console.error("Erreur lors de l'initialisation de la DB :", error);
      }
    }

    init();
  }, []);

  if (!dbPret) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Initialisation de la base de données...</Text>
      </View>
    );
  }

  return (
    <SessionParentProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SessionParentProvider>
  );
}