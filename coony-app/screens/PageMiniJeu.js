import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import MiniJeuRespiration from '../components/Mini_Jeux/Mini_Jeu_Respiration';

export default function PageConteneurMiniJeu() {
  const { id } = useLocalSearchParams();

  const quitterJeu = () => {
    router.replace('/tableau_de_bord_enfant'); 
  };

  const renderGame = () => {
    switch (id) {
      case '1':
        return <MiniJeuRespiration />;

      default:
        return (
          <View style={styles.containerFallback}>
            <Ionicons name="construct-outline" size={80} color="#CCC" />
            <Text style={styles.titreFallback}>Bientôt disponible !</Text>
            <Text style={styles.texteFallback}>
              Coony prépare encore ce petit moment pour toi.
            </Text>
            <TouchableOpacity 
              style={styles.boutonRetour} 
              onPress={quitterJeu}
            >
              <Text style={styles.texteBouton}>Retourner au tableau de bord</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <View style={styles.safeArea}>
      {/* Bouton de sortie flottant */}
      <TouchableOpacity style={styles.boutonFermer} onPress={quitterJeu}>
        <Ionicons name="close-circle" size={40} color="#333" />
      </TouchableOpacity>

      {renderGame()}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  boutonFermer: {
    position: 'absolute',
    top: 50, 
    right: 20,
    zIndex: 999, 
    opacity: 0.7, 
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