// Các màu cơ bản
export const baseColors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
  error: '#FF3B30',
  info: '#5AC8FA',
  light: '#F2F2F7',
  dark: '#1C1C1E',
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  priority: {
    low: '#34C759',
    medium: '#FF9500',
    high: '#FF3B30',
  },
  status: {
    pending: '#FF9500',
    completed: '#34C759',
  },
};

// Theme sáng
export const lightTheme = {
  ...baseColors,
  primary: baseColors.primary,
  secondary: baseColors.secondary,
  success: baseColors.success,
  warning: baseColors.warning,
  danger: baseColors.danger,
  error: baseColors.error,
  info: baseColors.info,
  bg_primary: baseColors.primary,

  // Màu nền
  background: baseColors.white,
  card: baseColors.white,
  surface: baseColors.gray[50],

  // Màu văn bản
  text: baseColors.dark,
  textSecondary: baseColors.gray[600],
  textDisabled: baseColors.gray[400],

  // Màu viền
  border: baseColors.gray[200],
  divider: baseColors.gray[200],

  // Màu trạng thái
  statusBar: baseColors.primary,

  // Màu ưu tiên và trạng thái
  priority: baseColors.priority,
  status: baseColors.status,

  // Các màu khác
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

// Theme tối
export const darkTheme = {
  ...baseColors,
  primary: baseColors.primary,
  secondary: baseColors.secondary,
  success: baseColors.success,
  warning: baseColors.warning,
  danger: baseColors.danger,
  error: baseColors.error,
  info: baseColors.info,
  bg_primary: baseColors.dark,

  // Màu nền
  background: baseColors.dark,
  card: '#2C2C2E',
  surface: '#3A3A3C',

  // Màu văn bản
  text: baseColors.white,
  textSecondary: baseColors.gray[300],
  textDisabled: baseColors.gray[500],

  // Màu viền
  border: baseColors.gray[700],
  divider: baseColors.gray[700],

  // Màu trạng thái
  statusBar: baseColors.dark,

  // Màu ưu tiên và trạng thái
  priority: baseColors.priority,
  status: baseColors.status,

  // Các màu khác
  shadow: 'rgba(0, 0, 0, 0.3)',
  overlay: 'rgba(0, 0, 0, 0.7)',
};

// Export màu mặc định (để tương thích với code cũ)
export const colors = {
  ...lightTheme,
  black: baseColors.black,
  white: baseColors.white,
  gray: baseColors.gray,
};

export const fonts = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System',
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

export const theme = {
  colors,
  fonts,
  spacing,
  borderRadius,
  shadows,
};

export default theme;
