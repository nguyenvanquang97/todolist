import React from 'react';
import {View, ActivityIndicator, Text, StyleSheet} from 'react-native';
import {globalStyles} from '@styles/globalStyles';
import {useTheme} from '@context/ThemeContext';
import {useTranslation} from '@i18n/i18n';
import {spacing, fonts} from '@styles/theme';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'small' | 'large';
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  text,
  size = 'large',
  color,
}) => {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const loadingText = text || t('settings.loading');
  const spinnerColor = color || colors.primary;
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={spinnerColor} />
      {loadingText && (
        <Text style={[styles.text, {color: colors.text}]}>{loadingText}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  text: {
    marginTop: spacing.md,
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weight.medium,
    textAlign: 'center',
  },
});

export default LoadingSpinner;
