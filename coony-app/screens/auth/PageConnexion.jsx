import { 
  View, 
  Text, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView 
} from "react-native";
import { Ionicons } from '@expo/vector-icons';

import COLORS from "../../src/utils/colors";
import FondOnde from "../../src/components/FondOnde";
import { useConnexionParent } from "../../src/hooks/auth/useConnexion";

export default function Connexion() {
  const {
    email, setEmail,
    motDePasse, setMotDePasse,
    chargement,
    handleConnexion,
    handleMotDePasseOublie,
  } = useConnexionParent();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <FondOnde />

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titreContainer}>
          <Text style={styles.titre}>CONNEXION</Text>
        </View>

        <View style={styles.carte}>
          <View style={styles.champGroup}>
            <Text style={styles.label}>Identifiant (Email)</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="votre@mail.com"
              placeholderTextColor={COLORS.textLight}
            />
          </View>

          <View style={styles.champGroup}>
            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              style={styles.input}
              value={motDePasse}
              onChangeText={setMotDePasse}
              secureTextEntry
            placeholder="••••••••"
              placeholderTextColor={COLORS.textLight}
            />
          </View>

          <TouchableOpacity onPress={handleMotDePasseOublie} style={styles.mdpOublieContainer}>
            <Text style={styles.mdpOublieTexte}>Mot de passe oublié ?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.boutonPrincipal, chargement && { opacity: 0.7 }]}
          onPress={handleConnexion}
          disabled={chargement}
        >
          <Text style={styles.boutonTexte}>
            {chargement ? "CONNEXION EN COURS..." : "SE CONNECTER"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity style={styles.boutonRetour} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={28} color={COLORS.text} />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 28,
    paddingTop: 110,
    paddingBottom: 40,
    flexGrow: 1,
    backgroundColor: 'transparent',
  },
  titreContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  titre: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: 2,
  },
  carte: {
    backgroundColor: COLORS.card,
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingVertical: 28,
    marginBottom: 30,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  champGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: "700",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    height: 50,
    paddingHorizontal: 16,
    color: COLORS.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  mdpOublieContainer: {
    alignSelf: "flex-end",
    marginTop: -2,
  },
  mdpOublieTexte: {
    fontSize: 14,
    color: COLORS.textLight,
    textDecorationLine: "underline",
    fontWeight: "500",
  },
  boutonPrincipal: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  boutonTexte: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: 1,
  },
  boutonRetour: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.card,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.12,
  },
});