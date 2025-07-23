import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@context/ThemeContext';
import { spacing, borderRadius, fonts } from '@styles/theme';
import { useTranslation } from '@i18n/index';
import { RootStackParamList } from '@/navigation/RootStackNavigator';


type CategoryTagManagementScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const CategoryTagManagementScreen: React.FC = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<CategoryTagManagementScreenNavigationProp>();

  const styles = createStyles(colors);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('settings.categories.tags')}</Text>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation.navigate('CategoryManagement')}
        >
          <View style={styles.settingInfo}>
            <Icon name="folder-outline" size={22} color={colors.text} />
            <Text style={[styles.settingText, { color: colors.text }]}>
              {t('settings.categories.manage')}
            </Text>
          </View>
          <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation.navigate('TagManagement')}
        >
          <View style={styles.settingInfo}>
            <Icon name="pricetag-outline" size={22} color={colors.text} />
            <Text style={[styles.settingText, { color: colors.text }]}>
              {t('settings.tags.manage')}
            </Text>
          </View>
          <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
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

export default CategoryTagManagementScreen;