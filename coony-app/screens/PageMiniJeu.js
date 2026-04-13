import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// 1. Import de ton composant de respiration
import MiniJeuRespiration from '../components/Mini_Jeux/Mini_Jeu_Respiration';

export default function PageConteneurMiniJeu() {
  // On récupère l'ID envoyé par le questionnaire ou le dashboard
  const { id } = useLocalSearchParams();

  // 2. Fonction de rendu conditionnel
  const renderGame = () => {
    switch (id) {
      case '1': // L'ID de "Respiration 4-4" dans ta BDD
        return <MiniJeuRespiration />;
      
      /* Tu ajouteras les autres cases ici au fur et à mesure :
      case '2':
        return <MiniJeuPauseCalme />;
      */

      default:
        // Cas de secours si le jeu n'est pas encore implémenté
        return (
          <View style={styles.containerFallback}>
            <Ionicons name="construct-outline" size={80} color="#CCC" />
            <Text style={styles.titreFallback}>Bientôt disponible !</Text>
            <Text style={styles.texteFallback}>
              Coony prépare encore ce petit moment pour toi.
            </Text>
            <TouchableOpacity 
              style={styles.boutonRetour} 
              onPress={() => router.replace('/dashboard-enfant')}
            >
              <Text style={styles.texteBouton}>Retourner au tableau de bord</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <View style={styles.safeArea}>
      {renderGame()}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  containerFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  titreFallback: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
  texteFallback: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 10,
    marginBottom: 40,
  },
  boutonRetour: {
    backgroundColor: '#D9D9D9',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  texteBouton: {
    fontWeight: 'bold',
    fontSize: 16,
  }
});