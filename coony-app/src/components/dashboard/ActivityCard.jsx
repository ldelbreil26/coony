import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../../utils/colors';

/**
 * Un composant de carte conçu pour afficher des activités ou des mini-jeux sur le tableau de bord.
 * 
 * Prend en charge un état désactivé (verrouillé), courant pour les activités qui doivent être
 * déverrouillées par la progression ou la complétion d'un questionnaire.
 * 
 * @param {Object} props
 * @param {string} props.title - Le nom principal de l'activité.
 * @param {string} [props.label] - Un court texte secondaire (catégorie ou type) affiché au-dessus du titre.
 * @param {string} [props.icon] - Le nom MaterialCommunityIcons pour l'icône de l'activité.
 * @param {string} [props.color] - La couleur thématique pour l'arrière-plan de l'icône et le badge.
 * @param {Function} [props.onPress] - Rappel exécuté lorsque la carte est touchée.
 * @param {boolean} [props.disabled=false] - Si vrai, la carte est grisée et non interactive.
 * @param {string} [props.badgeIcon='play'] - L'icône à afficher dans le badge d'action (ex : 'play', 'lock').
 */
const ActivityCard = ({ title, label, icon, color, onPress, disabled, badgeIcon = "play" }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        // Retour visuel pour l'état verrouillé/désactivé.
        disabled && styles.disabled
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={[
        styles.iconCercle, 
        // Si la couleur n'est pas fournie, utilise par défaut la couleur de texte standard.
        { backgroundColor: color || COLORS.text }
      ]}>
        <MaterialCommunityIcons 
          name={icon || "lock"} 
          size={24} 
          color={COLORS.white} 
        />
      </View>
      
      <View style={styles.contenuTexte}>
        {label && <Text style={styles.label}>{label}</Text>}
        <Text style={[
          styles.valeur,
          // Désaccentue le texte si l'activité est désactivée.
          { color: disabled ? COLORS.textLight : COLORS.text }
        ]}>
          {title}
        </Text>
      </View>

      {/* Badge d'action : Affiché uniquement si l'activité est accessible. */}
      {!disabled && (
        <View style={[styles.badge, { backgroundColor: color }]}>
          <MaterialCommunityIcons name={badgeIcon} size={16} color={COLORS.white} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  disabled: {
    opacity: 0.7,
    backgroundColor: '#F5F5F5',
    elevation: 0,
  },
  iconCercle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contenuTexte: {
    flex: 1,
    marginLeft: 15,
  },
  label: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.textLight,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  valeur: {
    fontSize: 18,
    fontWeight: "900",
    marginTop: 2,
  },
  badge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ActivityCard;
