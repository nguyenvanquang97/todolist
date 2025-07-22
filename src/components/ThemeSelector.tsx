import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@context/ThemeContext';
import { spacing, borderRadius, fonts } from '@styles/theme';
import { useTranslation } from '@i18n/i18n';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeSelectorProps {
  onClose: () => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onClose }) => {
  const { theme, setTheme, colors } = useTheme();
  const { t } = useTranslation();

  const themeOptions: { value: ThemeType; label: string; icon: string }[] = [
    { value: 'light', label: t('settings.theme.light'), icon: 'sunny-outline' },
    { value: 'dark', label: t('settings.theme.dark'), icon: 'moon-outline' },
    { value: 'system', label: t('settings.theme.system'), icon: 'phone-portrait-outline' },
  ];

  const handleSelectTheme = (selectedTheme: ThemeType) => {
    setTheme(selectedTheme);
    onClose();
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('settings.theme')}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="close-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.optionsContainer}>
        {themeOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionItem,
              theme === option.value && styles.selectedOption,
            ]}
            onPress={() => handleSelectTheme(option.value)}
          >
            <Icon
              name={option.icon}
              size={24}
              color={theme === option.value ? colors.primary : colors.text}
            />
            <Text
              style={[
                styles.optionText,
                theme === option.value && styles.selectedOptionText,
              ]}
            >
              {option.label}
            </Text>
            {theme === option.value && (
              <Icon name="checkmark" size={20} color={colors.primary} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fonts.sizes.lg,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: spacing.xs,
  },
  optionsContainer: {
    width: '100%',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  selectedOption: {
    backgroundColor: colors.primaryLight,
  },
  optionText: {
    fontSize: fonts.sizes.md,
    color: colors.text,
    marginLeft: spacing.md,
    flex: 1,
  },
  selectedOptionText: {
    color: colors.primary,
    fontWeight: '600',
  },
});

export default ThemeSelector;
