import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Switch,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

import { useSessionParent } from "../../src/state/sessionParent";
import COLORS from "../../src/utils/colors";
import FondOnde from "../../src/components/FondOnde";

import Card from "../../src/components/common/Card";
import Pastille from "../../src/components/common/Pastille";
import Input from "../../src/components/common/Input";
import Button from "../../src/components/common/Button";

import { useInscription } from "../../src/hooks/useInscription";

export default function Inscription() {
  const { setParentConnecte } = useSessionParent();
  const router = useRouter();
  
  const { 
    form, 
    updateField, 
    handleInscription, 
    chargement 
  } = useInscription(setParentConnecte);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={styles.mainWrapper}>
        <FondOnde />
        
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          
          <View style={styles.titreContainer}>
            <Text style={styles.titre}>CRÉATION DE COMPTE</Text>
          </View>

          <Card style={styles.carte}>
            <Pastille text="PARENT" style={styles.pastilleSpacing} />

            <Input 
              label="Adresse Mail"
              value={form.email}
              onChangeText={(val) => updateField("email", val)}
              placeholder="exemple@mail.com"
              keyboardType="email-address"
            />

            <Input 
              label="Mot de passe"
              value={form.motDePasse}
              onChangeText={(val) => updateField("motDePasse", val)}
              placeholder="6 caractères minimum"
              secureTextEntry
            />
          </Card>

          <Card style={styles.carte}>
            <View style={styles.headerEnfant}>
              <Pastille text="ENFANT" color={COLORS.accent} style={styles.pastilleSpacing} />
              <View style={styles.numero}>
                <Text style={styles.numeroTexte}>1</Text>
              </View>
            </View>

            <Input 
              label="Prénom"
              value={form.prenomEnfant}
              onChangeText={(val) => updateField("prenomEnfant", val)}
              placeholder="Son prénom"
            />

            <Input 
              label="Date de naissance"
              value={form.dateNaissance}
              onChangeText={(val) => updateField("dateNaissance", val)}
              placeholder="YYYY-MM-DD"
            />

            <View style={styles.separateur} />

            <View style={styles.switchRow}>
              <Text style={styles.labelSwitch}>Je suis le responsable légal</Text>
              <Switch 
                value={form.responsableLegal} 
                onValueChange={(val) => updateField("responsableLegal", val)}
                trackColor={{ false: "#D1D1D1", true: COLORS.secondary }}
                thumbColor={form.responsableLegal ? COLORS.primary : COLORS.secondary}
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.labelSwitch}>J'accepte la confidentialité</Text>
              <Switch 
                value={form.confidentialite} 
                onValueChange={(val) => updateField("confidentialite", val)}
                trackColor={{ false: "#D1D1D1", true: COLORS.secondary }}
                thumbColor={form.confidentialite ? COLORS.primary : COLORS.secondary}
              />
            </View>
          </Card>

          <Button 
            title={chargement ? "CRÉATION EN COURS..." : "CRÉER MON COMPTE"}
            onPress={handleInscription}
            loading={chargement}
            style={styles.boutonAction}
          />

        </ScrollView>

        <TouchableOpacity style={styles.boutonRetour} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={COLORS.text} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1 },
  container: { paddingHorizontal: 24, paddingTop: 100, paddingBottom: 40, flexGrow: 1 },
  titreContainer: { alignItems: "center", marginBottom: 30 },
  titre: { fontSize: 22, fontWeight: "900", color: COLORS.primary, letterSpacing: 1.2 },
  carte: { 
    marginBottom: 24, 
    padding: 22,
  },
  pastilleSpacing: {
    marginBottom: 20,
  },
  headerEnfant: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  numero: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.accent, alignItems: "center", justifyContent: "center", marginBottom: 20 },
  numeroTexte: { fontWeight: "900", color: COLORS.text },
  separateur: { height: 1, backgroundColor: COLORS.accent, marginVertical: 20, opacity: 0.5 },
  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  labelSwitch: { fontSize: 14, color: COLORS.text, fontWeight: "600", flex: 1 },
  boutonAction: { marginTop: 10 },
  boutonRetour: { position: "absolute", top: 50, left: 20, width: 46, height: 46, borderRadius: 23, backgroundColor: COLORS.card, justifyContent: "center", alignItems: "center", elevation: 6 }
});
