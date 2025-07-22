import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { globalStyles } from '@styles/globalStyles';
import { useTheme } from '@context/ThemeContext';
import { useTranslation } from '@i18n/i18n';

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
  const { colors } = useTheme();
  const { t } = useTranslation();
  const loadingText = text || t('settings.loading');
  const spinnerColor = color || colors.primary;
  return (
    <View style={globalStyles.loadingContainer}>
      <ActivityIndicator size={size} color={spinnerColor} />
      {loadingText && <Text style={globalStyles.loadingText}>{loadingText}</Text>}
    </View>
  );
};

export default LoadingSpinner;
