import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@context/ThemeContext';

interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  backgroundColor,
  progressColor,
}) => {
  const { colors } = useTheme();
  
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <View
      style={[
        styles.container,
        {
          height,
          backgroundColor: backgroundColor || colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.progressBar,
          {
            width: `${clampedProgress}%`,
            backgroundColor: progressColor || colors.primary,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
});

export default ProgressBar;