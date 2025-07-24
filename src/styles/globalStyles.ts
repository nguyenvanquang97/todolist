import { StyleSheet } from 'react-native';
import { spacing, borderRadius, fonts } from './theme';
import { useTheme } from '@context/ThemeContext';
import { useMemo } from 'react';
import { DEVICE_HEIGHT, DEVICE_WIDTH } from '@/utils/constants';

// Lưu ý: Chúng ta không import colors trực tiếp nữa
// Thay vào đó, chúng ta sẽ sử dụng colors từ ThemeContext

const createGlobalStyles = (colors: any) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenPadding: {
    paddingHorizontal: spacing.md,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  spaceBetween: {
    justifyContent: 'space-between' as const,
  },
  // Text styles
  title: {
    fontSize: fonts.sizes.xxl,
    fontWeight: 'bold' as const,
    color: colors.text,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  bodyText: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  caption: {
    fontSize: fonts.sizes.sm,
    color: colors.textDisabled,
  },
  // Button styles
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    minHeight: 44,
  },
  buttonText: {
    color: colors.white,
    fontSize: fonts.sizes.md,
    fontWeight: '600' as const,
  },
  buttonSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonSecondaryText: {
    color: colors.text,
  },
  buttonDanger: {
    backgroundColor: colors.danger,
  },
  buttonSuccess: {
    backgroundColor: colors.success,
  },
  // Input styles
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    fontSize: fonts.sizes.md,
    backgroundColor: colors.surface,
    color: colors.text,
    minHeight: 44,
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  inputError: {
    borderColor: colors.danger,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  // Card styles
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.xs,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: spacing.sm,
  },
  // List styles
  listContainer: {
    paddingVertical: spacing.sm,
  },
  listItem: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginVertical: spacing.xs,
    marginHorizontal: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listItemPressed: {
    backgroundColor: colors.surface,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    margin: spacing.md,
    maxHeight: DEVICE_HEIGHT * 0.8,
    width: DEVICE_WIDTH * 0.9,
  },
  modalHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  modalTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: '600' as const,
    color: colors.text,
  },
  // Form styles
  formGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fonts.sizes.sm,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  errorText: {
    fontSize: fonts.sizes.sm,
    color: colors.danger,
    marginTop: spacing.xs,
  },
  // Priority styles
  priorityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start' as const,
  },
  priorityText: {
    fontSize: fonts.sizes.xs,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
    // Loại bỏ thuộc tính display không hợp lệ
  },
  priorityLow: {
    backgroundColor: colors.priority.low + '20',
  },
  priorityLowText: {
    color: colors.priority.low,
  },
  priorityMedium: {
    backgroundColor: colors.priority.medium + '20',
  },
  priorityMediumText: {
    color: colors.priority.medium,
  },
  priorityHigh: {
    backgroundColor: colors.priority.high + '20',
  },
  priorityHighText: {
    color: colors.priority.high,
  },
  // Status styles
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start' as const,
  },
  statusText: {
    fontSize: fonts.sizes.xs,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
  },
  statusPending: {
    backgroundColor: colors.status.pending + '20',
  },
  statusPendingText: {
    color: colors.status.pending,
  },
  statusCompleted: {
    backgroundColor: colors.status.completed + '20',
  },
  statusCompletedText: {
    color: colors.status.completed,
  },
  // Loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
  },
  // Empty state styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingHorizontal: spacing.lg,
  },
  emptyText: {
    fontSize: fonts.sizes.lg,
    fontWeight: '600' as const,
    textAlign: 'center' as const,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: fonts.sizes.md,
    textAlign: 'center' as const,
    lineHeight: 22,
  },

  // Form styles
  formContainer: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: spacing.md,
  },
  characterCount: {
    fontSize: fonts.sizes.sm,
    color: colors.textDisabled,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  priorityContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginTop: spacing.sm,
  },
  priorityOption: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  dateButton: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateButtonText: {
    fontSize: fonts.sizes.md,
    color: colors.text,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export const useGlobalStyles = () => {
  const { colors } = useTheme();

  // Sử dụng useMemo để tránh tạo lại styles mỗi khi component render
  return useMemo(() => StyleSheet.create(createGlobalStyles(colors)), [colors]);
};

