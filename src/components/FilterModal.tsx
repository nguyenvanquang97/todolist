import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { TaskFilter } from '../types/Task';
import { colors, spacing, borderRadius, fonts } from '../styles/theme';
import { globalStyles } from '../styles/globalStyles';

interface FilterModalProps {
  visible: boolean;
  currentFilter: TaskFilter;
  onClose: () => void;
  onApplyFilter: (filter: TaskFilter) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  currentFilter,
  onClose,
  onApplyFilter,
}) => {
  const [tempFilter, setTempFilter] = useState<TaskFilter>(currentFilter);

  const statusOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'pending', label: 'Chưa hoàn thành' },
    { value: 'completed', label: 'Đã hoàn thành' },
  ];

  const priorityOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'high', label: 'Cao' },
    { value: 'medium', label: 'Trung bình' },
    { value: 'low', label: 'Thấp' },
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
    options: Array<{ value: string; label: string }>,
    selectedValue: string | undefined,
    onSelect: (value: string) => void
  ) => {
    return options.map((option) => (
      <TouchableOpacity
        key={option.value}
        style={[
          styles.optionButton,
          selectedValue === option.value && styles.selectedOption,
        ]}
        onPress={() => onSelect(option.value)}
      >
        <Text
          style={[
            styles.optionText,
            selectedValue === option.value && styles.selectedOptionText,
          ]}
        >
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
      onRequestClose={onClose}
    >
      <View style={globalStyles.modalOverlay}>
        <View style={globalStyles.modalContent}>
          <View style={globalStyles.modalHeader}>
            <Text style={globalStyles.modalTitle}>Lọc công việc</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color={colors.gray[600]} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Trạng thái</Text>
              <View style={styles.optionsContainer}>
                {renderOption(
                  statusOptions,
                  tempFilter.status,
                  (value) =>
                    setTempFilter({
                      ...tempFilter,
                      status: value as 'pending' | 'completed' | 'all',
                    })
                )}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mức độ ưu tiên</Text>
              <View style={styles.optionsContainer}>
                {renderOption(
                  priorityOptions,
                  tempFilter.priority,
                  (value) =>
                    setTempFilter({
                      ...tempFilter,
                      priority: value as 'low' | 'medium' | 'high' | 'all',
                    })
                )}
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[globalStyles.button, globalStyles.buttonSecondary, styles.button]}
              onPress={handleReset}
            >
              <Text style={[globalStyles.buttonText, globalStyles.buttonSecondaryText]}>
                Đặt lại
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[globalStyles.button, styles.button]}
              onPress={handleApply}
            >
              <Text style={globalStyles.buttonText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  content: {
    maxHeight: 400,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fonts.sizes.md,
    fontWeight: '600',
    color: colors.dark,
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
    borderColor: colors.gray[300],
    backgroundColor: colors.white,
  },
  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  optionText: {
    fontSize: fonts.sizes.md,
    color: colors.gray[700],
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
});

export default FilterModal;