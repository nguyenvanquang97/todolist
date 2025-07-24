import React, { useRef, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Toast, { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';
import { useTheme } from '@context/ThemeContext';
import { spacing, fonts } from '@styles/theme';

interface ToastProviderProps {
  children: React.ReactNode;
}

export const showToast = (type: 'success' | 'error' | 'info', text1: string, text2?: string) => {
  Toast.show({
    type,
    text1,
    text2,
    position: 'bottom',
    visibilityTime: 4000,
    autoHide: true,
    topOffset: 30,
    bottomOffset: 40,
  });
};

const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const { colors } = useTheme();
  
  const toastConfig: ToastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={[styles.toast, { borderLeftColor: colors.success }]}
        contentContainerStyle={styles.contentContainer}
        text1Style={[styles.text1, { color: colors.text }]}
        text2Style={[styles.text2, { color: colors.textSecondary }]}
      />
    ),
    error: (props) => (
      <ErrorToast
        {...props}
        style={[styles.toast, { borderLeftColor: colors.error }]}
        contentContainerStyle={styles.contentContainer}
        text1Style={[styles.text1, { color: colors.text }]}
        text2Style={[styles.text2, { color: colors.textSecondary }]}
      />
    ),
    info: (props) => (
      <BaseToast
        {...props}
        style={[styles.toast, { borderLeftColor: colors.primary }]}
        contentContainerStyle={styles.contentContainer}
        text1Style={[styles.text1, { color: colors.text }]}
        text2Style={[styles.text2, { color: colors.textSecondary }]}
      />
    ),
  };

  return (
    <>
      {children}
      <Toast config={toastConfig} />
    </>
  );
};

const styles = StyleSheet.create({
  toast: {
    borderRadius: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contentContainer: {
    paddingHorizontal: spacing.md,
  },
  text1: {
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.bold,
  },
  text2: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.regular,
  },
});

export default ToastProvider;