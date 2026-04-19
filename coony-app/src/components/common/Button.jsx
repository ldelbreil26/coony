import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import COLORS from '../../utils/colors';

/**
 * Composant Bouton réutilisable pour l'application.
 * 
 * Ce composant offre une apparence et une sensation cohérentes pour tous les boutons,
 * prenant en charge plusieurs styles visuels, états de chargement et icônes optionnelles.
 * 
 * @param {Object} props
 * @param {Function} props.onPress - Fonction à appeler lorsque le bouton est pressé.
 * @param {string} props.title - Le texte à afficher sur le bouton.
 * @param {'primary' | 'secondary' | 'accent' | 'outline'} [props.type='primary'] - Le style visuel du bouton.
 * @param {Object} [props.style] - Styles supplémentaires pour le conteneur du bouton.
 * @param {Object} [props.textStyle] - Styles supplémentaires pour le texte du bouton.
 * @param {boolean} [props.disabled] - Indique si le bouton est interactif.
 * @param {boolean} [props.loading] - Indique s'il faut afficher un indicateur de chargement au lieu du texte/icône.
 * @param {React.ElementType} [props.icon] - Un composant icône optionnel à afficher à côté du texte.
 */
const Button = ({ 
  onPress, 
  title, 
  type = 'primary', 
  style, 
  textStyle, 
  disabled, 
  loading,
  icon: Icon
}) => {
  /**
   * Détermine les styles d'arrière-plan et de bordure en fonction de la prop 'type'.
   */
  const getButtonStyle = () => {
    switch (type) {
      case 'secondary': return styles.buttonSecondary;
      case 'accent': return styles.buttonAccent;
      case 'outline': return styles.buttonOutline;
      default: return styles.buttonPrimary;
    }
  };

  /**
   * Détermine la couleur du texte en fonction de la prop 'type'.
   */
  const getTextStyle = () => {
    switch (type) {
      case 'outline': return styles.textOutline;
      default: return styles.textWhite;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), style, (disabled || loading) && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        // Affiche un indicateur de chargement lorsque 'loading' est vrai pour fournir un retour sur les actions asynchrones.
        <ActivityIndicator color={type === 'outline' ? COLORS.primary : COLORS.white} />
      ) : (
        <>
          {Icon && <Icon />}
          <Text style={[styles.text, getTextStyle(), textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    elevation: 4,
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },
  buttonSecondary: {
    backgroundColor: COLORS.secondary,
  },
  buttonAccent: {
    backgroundColor: COLORS.accent,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
    elevation: 0,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: '800',
  },
  textWhite: {
    color: COLORS.white,
  },
  textOutline: {
    color: COLORS.primary,
  },
});

export default Button;
