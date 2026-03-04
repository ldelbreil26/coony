import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";

import { initialiserBaseDeDonnees } from "../db/baseDeDonnees";
import { listerTables } from "../db/requetes";
import { seedCatalogues } from "../db/seed";
import { creerCompteParent, connecterParent, creerProfilEnfant, listerEnfantsDuParent } from "../db/requetesMetier";

export default function RootLayout() {

  const [dbPret, setDbPret] = useState(false);

  useEffect(() => {

    async function init() {

      try {

        console.log("Initialisation de la base de données");

        await initialiserBaseDeDonnees();

        console.log("Base de données prête");

        const tables = await listerTables();

        console.log("Tables présentes :", tables);

        setDbPret(true);

      } catch (error) {

        console.error("Erreur lors de l'initialisation de la DB :", error);

      }

      await initialiserBaseDeDonnees();

      await seedCatalogues(); 

        const parent = await creerCompteParent("test@coony.fr", "1234");
        console.log("Parent créé:", parent);

        const session = await connecterParent("test@coony.fr", "1234");
        console.log("Login:", session);

        const enfant = await creerProfilEnfant(session.id_parent, "Léo", "2016-04-02");
        console.log("Enfant créé:", enfant);

        const enfants = await listerEnfantsDuParent(session.id_parent);
        console.log("Enfants du parent:", enfants); 

    }

    init();

  }, []);

  if (!dbPret) {

    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Init de la BDD</Text>
      </View>
    );

  }
  
  return <Stack />;

}