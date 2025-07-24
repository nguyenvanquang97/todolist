import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@context/ThemeContext';
import { useTranslation } from '@i18n/i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import { spacing, borderRadius, fonts } from '@styles/theme';
import NavigationService from '@navigation/NavigationService';
import { RootStackParamList } from '@navigation/RootStackNavigator';

const ManagementScreen: React.FC = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const navigateToScreen = (screenName: keyof RootStackParamList) => {
    NavigationService.navigate(screenName);
  };

  const styles = createStyles(colors);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('settings.organization')}
          </Text>
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigateToScreen('ProjectManagement')}
          >
            <View style={styles.settingInfo}>
              <Icon name="briefcase-outline" size={24} color={colors.primary} />
              <Text style={[styles.settingText, { color: colors.text }]}>
                {t('projectManagement.title')}
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigateToScreen('CategoryManagement')}
          >
            <View style={styles.settingInfo}>
              <Icon name="folder-outline" size={24} color={colors.primary} />
              <Text style={[styles.settingText, { color: colors.text }]}>
                {t('categoryManagement.title')}
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigateToScreen('TagManagement')}
          >
            <View style={styles.settingInfo}>
              <Icon name="pricetag-outline" size={24} color={colors.primary} />
              <Text style={[styles.settingText, { color: colors.text }]}>
                {t('tagManagement.title')}
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: fonts.sizes.md,
    fontWeight: '600',
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  settingText: {
    fontSize: fonts.sizes.md,
  },
});

export default ManagementScreen;