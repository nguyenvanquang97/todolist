import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@context/ThemeContext';
import { spacing, baseColors } from '@styles/theme';
import { createGlobalStyles } from '@styles/globalStyles';

interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'icon';
  icon?: string;
  iconPosition?: 'left' | 'right';
  iconSize?: number;
  iconColor?: string;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  icon,
  iconPosition = 'left',
  iconSize = 20,
  iconColor,
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const { colors } = useTheme();
  const globalStyles = createGlobalStyles(colors);

  // Xác định style dựa trên variant
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return globalStyles.buttonSecondary;
      case 'danger':
        return globalStyles.buttonDanger;
      case 'success':
        return globalStyles.buttonSuccess;
      case 'icon':
        return styles.iconButton;
      default:
        return {};
    }
  };

  // Xác định text style dựa trên variant
  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return globalStyles.buttonSecondaryText;
      default:
        return {};
    }
  };

  // Xác định màu icon nếu không được cung cấp
  const getIconColor = () => {
    if (iconColor) {return iconColor;}

    switch (variant) {
      case 'secondary':
        return colors.text;
      default:
        return baseColors.white;
    }
  };

  // Nếu là variant icon, chỉ hiển thị icon
  if (variant === 'icon') {
    return (
      <TouchableOpacity
        style={[
          styles.iconButton,
          disabled && styles.disabled,
          style,
        ]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={iconColor || colors.primary}
          />
        ) : (
          icon && (
            <Icon
              name={icon}
              size={iconSize}
              color={iconColor || colors.text}
            />
          )
        )}
      </TouchableOpacity>
    );
  }

  // Các variant khác
  return (
    <TouchableOpacity
      style={[
        globalStyles.button,
        getButtonStyle(),
        { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'secondary' ? colors.primary : baseColors.white}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Icon
              name={icon}
              size={iconSize}
              color={getIconColor()}
              style={styles.leftIcon}
            />
          )}
          {title && (
            <Text
              style={[
                globalStyles.buttonText,
                getTextStyle(),
                textStyle,
              ]}
            >
              {title}
            </Text>
          )}
          {icon && iconPosition === 'right' && (
            <Icon
              name={icon}
              size={iconSize}
              color={getIconColor()}
              style={styles.rightIcon}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  leftIcon: {
    marginRight: spacing.xs,
  },
  rightIcon: {
    marginLeft: spacing.xs,
  },
  disabled: {
    opacity: 0.6,
  },
  iconButton: {
    padding: spacing.xs,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40,
    minHeight: 40,
  },
});

export default Button;
