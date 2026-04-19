import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import COLORS from '../../utils/colors';

/**
 * Composant de saisie de texte réutilisable avec étiquetage intégré et gestion des erreurs.
 * 
 * Fournit une enveloppe standard pour le `TextInput` de React Native afin d'assurer
 * une cohérence visuelle et une accessibilité à travers les formulaires.
 * 
 * @param {Object} props
 * @param {string} [props.label] - Texte d'étiquette optionnel à afficher au-dessus du champ de saisie.
 * @param {string} props.value - La valeur actuelle de la saisie.
 * @param {Function} props.onChangeText - Rappel invoqué lorsque le contenu du texte change.
 * @param {string} [props.placeholder] - Texte d'espace réservé pour l'état de saisie vide.
 * @param {boolean} [props.secureTextEntry=false] - Si vrai, masque le texte saisi (utile pour les mots de passe).
 * @param {'default' | 'email-address' | 'numeric' | 'phone-pad'} [props.keyboardType='default'] - Spécifie le type de clavier virtuel.
 * @param {'none' | 'sentences' | 'words' | 'characters'} [props.autoCapitalize='none'] - Contrôle la capitalisation automatique.
 * @param {Object} [props.containerStyle] - Styles pour le conteneur View extérieur.
 * @param {string} [props.error] - Message d'erreur optionnel à afficher sous la saisie.
 */
const Input = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry, 
  keyboardType,
  autoCapitalize = 'none',
  containerStyle,
  error
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {/* Affiche l'étiquette au-dessus de la saisie si elle est fournie. */}
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TextInput
        style={[
          styles.input, 
          // Retour visuel pour les erreurs : change la couleur de la bordure en rouge.
          error && styles.inputError
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textLight}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
      />
      
      {/* Affiche le message d'erreur en texte rouge si une erreur existe. */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '700',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    height: 50,
    paddingHorizontal: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default Input;
