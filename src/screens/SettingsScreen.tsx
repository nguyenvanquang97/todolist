import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@context/ThemeContext';
import { useSettings } from '@context/SettingsContext';
import { spacing, borderRadius, fonts, baseColors } from '@styles/theme';
import ThemeToggle from '@components/ThemeToggle';
import { useTranslation } from '@i18n/index';

const SettingsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { settings, loading, error, updateNotifications, updateLanguage, resetSettings } = useSettings();
  const { t } = useTranslation();
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const handleClearData = () => {
    Alert.alert(
      t('settings.data.reset'),
      t('settings.data.reset.message'),
      [
        {
          text: t('settings.data.reset.cancel'),
          style: 'cancel',
        },
        {
          text: t('settings.data.reset.confirm'),
          style: 'destructive',
          onPress: () => {
            // Reset settings to default
            resetSettings();
            Alert.alert(t('app.name'), t('settings.data.reset'));
          },
        },
      ]
    );
  };

  const handleToggleNotifications = (value: boolean) => {
    updateNotifications(value);
  };

  const handleLanguageChange = (language: 'en' | 'vi') => {
    updateLanguage(language);
    setLanguageModalVisible(false);
  };

  const styles = createStyles(colors);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>{t('settings.loading')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Icon name="alert-circle-outline" size={50} color={colors.danger} />
        <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={resetSettings}
        >
          <Text style={styles.retryButtonText}>{t('settings.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('settings.theme')}</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="contrast-outline" size={22} color={colors.text} />
            <Text style={[styles.settingText, { color: colors.text }]}>{t('settings.theme')}</Text>
          </View>
          <ThemeToggle />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('settings.language')}</Text>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => setLanguageModalVisible(true)}
        >
          <View style={styles.settingInfo}>
            <Icon name="language-outline" size={22} color={colors.text} />
            <Text style={[styles.settingText, { color: colors.text }]}>{t('settings.language')}</Text>
          </View>
          <View style={styles.settingValue}>
            <Text style={[styles.valueText, { color: colors.textSecondary }]}>
              {settings.language === 'en' ? t('settings.language.en') : t('settings.language.vi')}
            </Text>
            <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('settings.notifications')}</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="notifications-outline" size={22} color={colors.text} />
            <Text style={[styles.settingText, { color: colors.text }]}>{t('settings.notifications.enable')}</Text>
          </View>
          <Switch
            value={settings.notifications_enabled}
            onValueChange={handleToggleNotifications}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={baseColors.white}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('settings.data')}</Text>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={handleClearData}
        >
          <View style={styles.settingInfo}>
            <Icon name="trash-outline" size={22} color={colors.danger} />
            <Text style={[styles.settingText, { color: colors.danger }]}>
              {t('settings.data.reset')}
            </Text>
          </View>
          <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('settings.info')}</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="information-circle-outline" size={22} color={colors.text} />
            <Text style={[styles.settingText, { color: colors.text }]}>{t('settings.info.version')}</Text>
          </View>
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>1.0.0</Text>
        </View>
        {settings.last_updated && (
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="time-outline" size={22} color={colors.text} />
              <Text style={[styles.settingText, { color: colors.text }]}>{t('settings.info.lastUpdated')}</Text>
            </View>
            <Text style={[styles.versionText, { color: colors.textSecondary }]}>
              {new Date(settings.last_updated).toLocaleString(settings.language === 'en' ? 'en-US' : 'vi-VN')}
            </Text>
          </View>
        )}
      </View>

      {/* Language Selection Modal */}
      <Modal
        visible={languageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setLanguageModalVisible(false)}
        >
          <View
            style={[styles.modalContent, { backgroundColor: colors.card }]}
            onStartShouldSetResponder={() => true}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t('settings.language')}</Text>

            <TouchableOpacity
              style={[styles.languageOption, settings.language === 'en' && styles.selectedOption]}
              onPress={() => handleLanguageChange('en')}
            >
              <Text style={[styles.languageText, { color: colors.text }]}>{t('settings.language.en')}</Text>
              {settings.language === 'en' && (
                <Icon name="checkmark" size={20} color={colors.primary} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.languageOption, settings.language === 'vi' && styles.selectedOption]}
              onPress={() => handleLanguageChange('vi')}
            >
              <Text style={[styles.languageText, { color: colors.text }]}>{t('settings.language.vi')}</Text>
              {settings.language === 'vi' && (
                <Icon name="checkmark" size={20} color={colors.primary} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.primary }]}
              onPress={() => setLanguageModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  settingText: {
    fontSize: fonts.sizes.md,
  },
  valueText: {
    fontSize: fonts.sizes.sm,
  },
  versionText: {
    fontSize: fonts.sizes.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fonts.sizes.md,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: '600',
    marginBottom: spacing.lg,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  selectedOption: {
    backgroundColor: `${colors.primary}20`,
  },
  languageText: {
    fontSize: fonts.sizes.md,
  },
  closeButton: {
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
  },
  closeButtonText: {
    color: baseColors.white,
    fontSize: fonts.sizes.md,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    fontSize: fonts.sizes.md,
    textAlign: 'center',
  },
  retryButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  retryButtonText: {
    color: baseColors.white,
    fontSize: fonts.sizes.md,
    fontWeight: '600',
  },
});

export default SettingsScreen;
