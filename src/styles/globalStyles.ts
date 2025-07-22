import { StyleSheet } from 'react-native';
import { colors, fonts, spacing, borderRadius, shadows } from './theme';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  screenPadding: {
    paddingHorizontal: spacing.md,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  // Text styles
  title: {
    fontSize: fonts.sizes.xxl,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: spacing.sm,
  },
  bodyText: {
    fontSize: fonts.sizes.md,
    color: colors.gray[700],
    lineHeight: 24,
  },
  caption: {
    fontSize: fonts.sizes.sm,
    color: colors.gray[500],
  },
  // Button styles
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  buttonText: {
    color: colors.white,
    fontSize: fonts.sizes.md,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: colors.gray[100],
    borderWidth: 1,
    borderColor: colors.gray[300],
  },
  buttonSecondaryText: {
    color: colors.gray[700],
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
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    fontSize: fonts.sizes.md,
    backgroundColor: colors.white,
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
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.xs,
    ...shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  // List styles
  listContainer: {
    paddingVertical: spacing.sm,
  },
  listItem: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginVertical: spacing.xs,
    marginHorizontal: spacing.md,
    ...shadows.sm,
  },
  listItemPressed: {
    backgroundColor: colors.gray[50],
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    margin: spacing.md,
    maxHeight: '80%',
    width: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  modalTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: '600',
    color: colors.dark,
  },
  // Form styles
  formGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fonts.sizes.sm,
    fontWeight: '600',
    color: colors.gray[700],
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
    alignSelf: 'flex-start',
  },
  priorityText: {
    fontSize: fonts.sizes.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
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
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: fonts.sizes.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fonts.sizes.md,
    color: colors.gray[600],
  },
  // Empty state styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  emptyText: {
    fontSize: fonts.sizes.lg,
    fontWeight: '600',
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: fonts.sizes.md,
    color: colors.gray[500],
    textAlign: 'center',
    lineHeight: 22,
  },

  // Form styles
  formContainer: {
    flex: 1,
    backgroundColor: colors.white,
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
    color: colors.gray[500],
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  priorityOption: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  dateButton: {
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[300],
  },
  dateButtonText: {
    fontSize: fonts.sizes.md,
    color: colors.dark,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default globalStyles;