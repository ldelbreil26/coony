import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import COLORS from '../../utils/colors';

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
  const getButtonStyle = () => {
    switch (type) {
      case 'secondary': return styles.buttonSecondary;
      case 'accent': return styles.buttonAccent;
      case 'outline': return styles.buttonOutline;
      default: return styles.buttonPrimary;
    }
  };

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
