import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { globalStyles } from '@styles/globalStyles';
import { useTheme } from '@context/ThemeContext';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'small' | 'large';
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  text = 'Đang tải...',
  size = 'large',
  color,
}) => {
  const { colors } = useTheme();
  const spinnerColor = color || colors.primary;
  return (
    <View style={globalStyles.loadingContainer}>
      <ActivityIndicator size={size} color={spinnerColor} />
      {text && <Text style={globalStyles.loadingText}>{text}</Text>}
    </View>
  );
};

export default LoadingSpinner;