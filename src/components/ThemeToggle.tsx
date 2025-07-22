import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@context/ThemeContext';
import ThemeSelector from './ThemeSelector';
import { spacing } from '@styles/theme';
import { useTranslation } from '@i18n/i18n';

interface ThemeToggleProps {
  style?: object;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ style }) => {
  const { theme, actualTheme, colors } = useTheme();
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return 'sunny-outline';
      case 'dark':
        return 'moon-outline';
      case 'system':
        return 'phone-portrait-outline';
      default:
        return actualTheme === 'dark' ? 'moon-outline' : 'sunny-outline';
    }
  };

  const getThemeText = () => {
    switch (theme) {
      case 'light':
        return t('settings.theme.light');
      case 'dark':
        return t('settings.theme.dark');
      case 'system':
        return t('settings.theme.system');
      default:
        return actualTheme === 'dark' ? t('settings.theme.dark') : t('settings.theme.light');
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.container, { backgroundColor: colors.card }, style]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <View style={styles.content}>
          <Icon
            name={getThemeIcon()}
            size={20}
            color={colors.text}
            style={styles.icon}
          />
          <Text style={[styles.text, { color: colors.text }]}>
            {getThemeText()}
          </Text>
          <Icon name="chevron-down" size={16} color={colors.textSecondary} />
        </View>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <ThemeSelector onClose={() => setModalVisible(false)} />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap:spacing.xs,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',

  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
  },
});

export default ThemeToggle;
