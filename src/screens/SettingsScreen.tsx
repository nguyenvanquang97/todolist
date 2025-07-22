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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@context/ThemeContext';
import { useSettings } from '@context/SettingsContext';
import { spacing, borderRadius, fonts, baseColors } from '@styles/theme';
import ThemeToggle from '@components/ThemeToggle';

const SettingsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { settings, loading, error, updateNotifications, resetSettings } = useSettings();

  const handleClearData = () => {
    Alert.alert(
      'Xác nhận xóa dữ liệu',
      'Bạn có chắc chắn muốn xóa tất cả dữ liệu? Hành động này không thể hoàn tác.',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            // Reset settings to default
            resetSettings();
            Alert.alert('Thông báo', 'Đã đặt lại cài đặt về mặc định');
          },
        },
      ]
    );
  };
  
  const handleToggleNotifications = (value: boolean) => {
    updateNotifications(value);
  };

  const styles = createStyles(colors);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Đang tải cài đặt...</Text>
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
          <Text style={styles.retryButtonText}>Thử lại</Text>
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
        <Text style={styles.sectionTitle}>Giao diện</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="contrast-outline" size={22} color={colors.text} />
            <Text style={styles.settingText}>Chế độ</Text>
          </View>
          <ThemeToggle />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông báo</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="notifications-outline" size={22} color={colors.text} />
            <Text style={styles.settingText}>Bật thông báo</Text>
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
        <Text style={styles.sectionTitle}>Dữ liệu</Text>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={handleClearData}
        >
          <View style={styles.settingInfo}>
            <Icon name="trash-outline" size={22} color={colors.danger} />
            <Text style={[styles.settingText, { color: colors.danger }]}>
              Đặt lại cài đặt
            </Text>
          </View>
          <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="information-circle-outline" size={22} color={colors.text} />
            <Text style={styles.settingText}>Phiên bản</Text>
          </View>
          <Text style={styles.versionText}>1.0.0</Text>
        </View>
        {settings.last_updated && (
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="time-outline" size={22} color={colors.text} />
              <Text style={styles.settingText}>Cập nhật lần cuối</Text>
            </View>
            <Text style={styles.versionText}>
              {new Date(settings.last_updated).toLocaleString('vi-VN')}
            </Text>
          </View>
        )}
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
    color: colors.textSecondary,
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
    color: colors.text,
  },
  versionText: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
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