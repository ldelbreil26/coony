import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function HeaderQuestionnaire() {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.bouton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back-outline" size={26} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.bouton}
        onPress={() => router.push("/tableau_de_bord_enfant")}
      >
        <Ionicons name="close-outline" size={28} color="#333" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 55,
    left: 24,
    right: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },

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