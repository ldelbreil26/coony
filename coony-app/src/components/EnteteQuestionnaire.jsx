import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import COLORS from "../utils/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function EnteteQuestionnaire({ etape }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerNav}>
        <TouchableOpacity style={styles.boutonCercle} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={26} color={COLORS.textLight} />
        </TouchableOpacity>
        <View style={styles.badgeEtape}>
          <Text style={styles.titreEtape}>Étape {etape} / 4</Text>
        </View>
        <TouchableOpacity
          style={styles.bouton}
          onPress={() => router.push("/tableau_de_bord_enfant")}
        >
          <Ionicons name="close-outline" size={28} color="#333" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { zIndex: 10 },
  headerNav: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, justifyContent: 'space-between' },
  boutonCercle: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white,
    justifyContent: "center", alignItems: "center", elevation: 3,
  },
  badgeEtape: { backgroundColor: 'rgba(255,255,255,0.6)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  titreEtape: { fontSize: 13, fontWeight: "900", color: COLORS.textLight, textTransform: "uppercase" },

  bouton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#EDE7E7",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
});