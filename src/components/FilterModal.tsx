import React, {useState} from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {TaskFilter} from '../types/Task';
import {spacing, borderRadius, fonts} from '@styles/theme';
import {globalStyles} from '@styles/globalStyles';
import {useTheme} from '@context/ThemeContext';
import Button from '@components/Button';

interface FilterModalProps {
  visible: boolean;
  currentFilter: TaskFilter;
  onClose: () => void;
  onApplyFilter: (filter: TaskFilter) => void;
}

// Using a function to create styles with theme colors
const createStyles = (colors: any) =>
  StyleSheet.create({
    content: {
      maxHeight: 400,
    },
    section: {
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      fontSize: fonts.sizes.md,
      fontWeight: '600',
      color: colors.text,
      marginBottom: spacing.sm,
    },
    optionsContainer: {
      gap: spacing.xs,
    },
    optionButton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.sm,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    selectedOption: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '20',
    },
    optionText: {
      fontSize: fonts.sizes.md,
      color: colors.textSecondary,
    },
    selectedOptionText: {
      color: colors.primary,
      fontWeight: '600',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.lg,
      gap: spacing.sm,
    },
    button: {
      flex: 1,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
      paddingBottom: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    modalTitle: {
      fontSize: fonts.sizes.lg,
      fontWeight: '600',
      color: colors.text,
    },
  });

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  currentFilter,
  onClose,
  onApplyFilter,
}) => {
  const {colors} = useTheme();
  const [tempFilter, setTempFilter] = useState<TaskFilter>(currentFilter);
  const styles = createStyles(colors);

  const statusOptions = [
    {value: 'all', label: 'Tất cả'},
    {value: 'pending', label: 'Chưa hoàn thành'},
    {value: 'completed', label: 'Đã hoàn thành'},
  ];

  const priorityOptions = [
    {value: 'all', label: 'Tất cả'},
    {value: 'high', label: 'Cao'},
    {value: 'medium', label: 'Trung bình'},
    {value: 'low', label: 'Thấp'},
  ];

  const handleApply = () => {
    onApplyFilter(tempFilter);
    onClose();
  };

  const handleReset = () => {
    const resetFilter: TaskFilter = {
      status: 'all',
      priority: 'all',
      searchQuery: '',
    };
    setTempFilter(resetFilter);
    onApplyFilter(resetFilter);
    onClose();
  };

  const renderOption = (
    options: Array<{value: string; label: string}>,
    selectedValue: string | undefined,
    onSelect: (value: string) => void,
  ) => {
    return options.map(option => (
      <TouchableOpacity
        key={option.value}
        style={[
          styles.optionButton,
          selectedValue === option.value && styles.selectedOption,
        ]}
        onPress={() => onSelect(option.value)}
        activeOpacity={0.7}>
        <Text
          style={[
            styles.optionText,
            selectedValue === option.value && styles.selectedOptionText,
          ]}>
          {option.label}
        </Text>
        {selectedValue === option.value && (
          <Icon name="checkmark" size={20} color={colors.primary} />
        )}
      </TouchableOpacity>
    ));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <TouchableOpacity
        style={globalStyles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}>
        <TouchableOpacity activeOpacity={1} onPress={e => e.stopPropagation()}>
          <View
            style={[globalStyles.modalContent, {backgroundColor: colors.card}]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Lọc công việc</Text>
              <TouchableOpacity
                onPress={onClose}
                activeOpacity={0.7}
                hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}>
                <Icon name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Trạng thái</Text>
                <View style={styles.optionsContainer}>
                  {renderOption(statusOptions, tempFilter.status, value =>
                    setTempFilter({
                      ...tempFilter,
                      status: value as 'pending' | 'completed' | 'all',
                    }),
                  )}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Mức độ ưu tiên</Text>
                <View style={styles.optionsContainer}>
                  {renderOption(priorityOptions, tempFilter.priority, value =>
                    setTempFilter({
                      ...tempFilter,
                      priority: value as 'low' | 'medium' | 'high' | 'all',
                    }),
                  )}
                </View>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <Button
                title="Đặt lại"
                variant="secondary"
                style={styles.button}
                onPress={handleReset}
              />

              <Button
                title="Áp dụng"
                style={styles.button}
                onPress={handleApply}
              />
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default FilterModal;
