import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';

import MiniJeuRespiration from "../../src/components/Mini_Jeux/Mini_Jeu_Respiration";

import { fetchMiniJeu } from "../../src/utils/mapper/miniJeuMapper";
import COLORS from "../../src/utils/colors";

export default function PageConteneurMiniJeu() {
  const { id } = useLocalSearchParams();

  const [jeuInfo, setJeuInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const chargerInfo = async () => {
      setLoading(true);
      try {
        const info = await fetchMiniJeu(id);
        setJeuInfo(info);
      } catch (error) {
        console.error("Erreur lors du chargement du jeu:", error);
      } finally {
        setLoading(false);
      }
    };
    chargerInfo();
  }, [id]);

  const quitterJeu = () => {
    router.replace('/tableau_de_bord_enfant'); 
  };

  if (loading) {
    return (
      <View style={[styles.mainContainer, styles.centered]}>
         <Text>Loading...</Text>
      </View>
    );
  }

  const renderGame = () => {
    switch (id?.toString()) {
      case '1':
        return <MiniJeuRespiration />;

      default:
        const maintenanceColor = jeuInfo?.color || COLORS.gray || '#E0E0E0';
        
        return (
          <View style={styles.containerFallback}>
            <View style={[styles.cercleIcone, { backgroundColor: maintenanceColor }]}>
              <MaterialCommunityIcons 
                name={jeuInfo?.icon || "hammer-wrench"} 
                size={60} 
                color="white" 
              />
            </View>
            <Text style={styles.titreFallback}>
              {jeuInfo?.libelle || "Bientôt disponible !"}
            </Text>
            <Text style={styles.texteFallback}>
              Coony prépare encore ce petit moment pour toi. Reviens très vite !
            </Text>
            
            <TouchableOpacity 
              style={[styles.boutonRetour, { backgroundColor: maintenanceColor }]} 
              onPress={quitterJeu}
            >
              <Text style={styles.texteBouton}>Retourner au tableau de bord</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity style={styles.boutonFermer} onPress={quitterJeu}>
        <MaterialCommunityIcons name="close-circle" size={45} color={COLORS.textLight} />
      </TouchableOpacity>
      {renderGame()}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  boutonFermer: {
    position: 'absolute',
    top: 50, 
    right: 20,
    zIndex: 9999,
    backgroundColor: 'white',
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5
  },
  containerFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  cercleIcone: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  titreFallback: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.text,
    textAlign: 'center',
  },
  texteFallback: {
    fontSize: 16,
    textAlign: 'center',
    color: COLORS.textLight,
    marginTop: 15,
    marginBottom: 40,
    lineHeight: 24,
  },
  boutonRetour: {
    paddingVertical: 18,
    paddingHorizontal: 35,
    borderRadius: 22,
    elevation: 4,
  },
  texteBouton: {
    color: 'white',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 0.5,
  }
});