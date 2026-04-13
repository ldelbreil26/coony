import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Mini_Jeu_Respiration() {
  const [etape, setEtape] = useState("Prêt ?");
  const [cyclesTermines, setCyclesTermines] = useState(0);
  const [jeuFini, setJeuFini] = useState(false);
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const totalCycles = 4; // Nombre de répétitions avant la fin

  useEffect(() => {
    if (!jeuFini) {
      lancerCycle();
    }
    return () => scaleAnim.stopAnimation();
  }, [cyclesTermines, jeuFini]);

  const lancerCycle = () => {
    if (cyclesTermines >= totalCycles) {
      setJeuFini(true);
      return;
    }

    // 1. INSPIRATION (4 secondes)
    setEtape("inspire");
    Animated.timing(scaleAnim, {
      toValue: 1.8,
      duration: 4000,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      
      // 2. PAUSE (2 secondes)
      setEtape("bloque");
      setTimeout(() => {
        
        // 3. EXPIRATION (4 secondes)
        setEtape("expire");
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }).start(() => {
          setCyclesTermines(prev => prev + 1);
        });
        
      }, 2000);
    });
  };

  const recommencer = () => {
    setCyclesTermines(0);
    setJeuFini(false);
    scaleAnim.setValue(1);
  };

  if (jeuFini) {
    return (
      <View style={styles.container}>
        <View style={styles.carteJeu}>
          <Ionicons name="checkmark-circle" size={80} color="#333" />
          <Text style={styles.titreFin}>Bravo !</Text>
          <Text style={styles.messageAide}>Tu as terminé tes 4 respirations. Te sens-tu plus calme ?</Text>
          
          <View style={styles.zoneBoutons}>
            <TouchableOpacity style={styles.boutonRecommencer} onPress={recommencer}>
              <Text style={styles.texteBouton}>RECOMMENCER</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.boutonQuitterFinal} 
              onPress={() => router.replace('/tableau_de_bord_enfant')}
            >
              <Text style={[styles.texteBouton, {color: '#FFF'}]}>TERMINER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.carteJeu}>
        <View style={styles.headerJeu}>
          <View style={styles.pastille}>
            <Text style={styles.pastilleTexte}>RESPIRATION 4-4 </Text>
          </View>
        </View>

        <View style={styles.zoneAnimation}>
          <Animated.View style={[styles.cercle, { transform: [{ scale: scaleAnim }] }]} />
          <Text style={styles.instruction}>{etape}</Text>
        </View>

        <View style={styles.footerJeu}>
          <Text style={styles.messageAide}>Laisse le cercle guider ...</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  carteJeu: {
    backgroundColor: "#D9D9D9",
    borderRadius: 22,
    padding: 24,
    minHeight: 450,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  headerJeu: { width: "100%" },
  pastille: {
    backgroundColor: "#F3F3F3",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 8,
    alignSelf: 'flex-start'
  },
  pastilleTexte: { fontSize: 14, fontWeight: "700", color: "#333" },
  zoneAnimation: { flex: 1, justifyContent: "center", alignItems: "center" },
  cercle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F4F4F4",
    borderWidth: 4,
    borderColor: "#FFF",
  },
  instruction: { position: "absolute", fontSize: 22, fontWeight: "700", color: "#333" },
  footerJeu: { marginTop: 20 },
  messageAide: { fontSize: 16, fontWeight: "600", color: "#333", textAlign: "center" },
  
  // Styles écran de fin
  titreFin: { fontSize: 28, fontWeight: "700", color: "#333", marginTop: 10 },
  zoneBoutons: { width: "100%", gap: 15, marginTop: 30 },
  boutonRecommencer: {
    backgroundColor: "#F3F3F3",
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
  },
  boutonQuitterFinal: {
    backgroundColor: "#333",
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
  },
  texteBouton: { fontSize: 16, fontWeight: "700", color: "#333" }
});