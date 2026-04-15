import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import COLORS from "../../utils/colors";

export default function MiniJeuRespirationCoony() {
  const [etape, setEtape] = useState("Prêt ?");
  const [cyclesTermines, setCyclesTermines] = useState(0);
  const [jeuFini, setJeuFini] = useState(false);
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const totalCycles = 4;

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

    setEtape("J'inspire...");
    Animated.timing(scaleAnim, {
      toValue: 2,
      duration: 4000,
      easing: Easing.inOut(Easing.sin),
      useNativeDriver: true,
    }).start(() => {
      
      setEtape("Je bloque un instant...");
      setTimeout(() => {
        
        setEtape("J'expire doucement...");
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
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
        <View style={styles.carteFin}>
          <View style={styles.cercleSucces}>
            <MaterialCommunityIcons name="star" size={50} color="#FFD700" />
          </View>
          <Text style={styles.titreFin}>C'est parfait !</Text>
          <Text style={styles.messageFin}>Ton corps est tout calme maintenant. Te sens-tu mieux ?</Text>
          
          <View style={styles.zoneBoutons}>
            <TouchableOpacity style={styles.boutonRecommencer} onPress={recommencer}>
              <Text style={styles.texteBoutonGris}>RECOMMENCER</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.boutonTerminer} 
              onPress={() => router.replace('/tableau_de_bord_enfant')}
            >
              <Text style={styles.texteBoutonBlanc}>TERMINER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.zoneCentrale}>
        
        <Animated.View style={[styles.bullePrincipale, { transform: [{ scale: scaleAnim }] }]}>
          <MaterialCommunityIcons name="leaf" size={40} color="rgba(255,255,255,0.7)" />
        </Animated.View>

        <Text style={styles.instruction}>{etape}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.guide}>Suis le mouvement de la bulle...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 120,
    paddingHorizontal: 30
  },
  zoneCentrale: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    width: '100%',
  },
  bullePrincipale: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#C5E1A5',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: "#AED581",
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  instruction: {
    marginTop: 130,
    fontSize: 26,
    fontWeight: "900",
    color: '#33691E',
    textAlign: "center",
    letterSpacing: 0.5,
  },
  footer: { marginTop: 10 },
  guide: { 
    fontSize: 16, 
    color: COLORS.textLight,
    fontWeight: "600", 
    fontStyle: 'italic', 
    textAlign: "center" 
  },

  carteFin: {
    backgroundColor: COLORS.white,
    padding: 30,
    borderRadius: 40,
    alignItems: 'center',
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 15,
  },
  cercleSucces: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#FFFDE7',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 20, borderWidth: 2, borderColor: '#FFD700'
  },
  titreFin: { fontSize: 26, fontWeight: "900", color: COLORS.text, marginBottom: 10 },
  messageFin: { fontSize: 16, textAlign: 'center', color: COLORS.textLight, lineHeight: 24, marginBottom: 35 },
  zoneBoutons: { width: '100%', gap: 15, padding : 2 },
  
  boutonRecommencer: { 
    paddingVertical: 18, 
    borderRadius: 20, 
    alignItems: 'center', 
    padding : 20,
    backgroundColor: '#F5F5F5'
  },
  boutonTerminer: { 
    paddingVertical: 18, 
    borderRadius: 20, 
    alignItems: 'center', 
    backgroundColor: '#689F38',
    elevation: 4
  },
  texteBoutonGris: { fontWeight: '800', color: COLORS.textLight, fontSize: 15 },
  texteBoutonBlanc: { fontWeight: '800', color: COLORS.white, fontSize: 16, letterSpacing: 0.5 }
});