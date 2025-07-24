import React, {useState} from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {TaskFilter} from '../types/Task';
import {spacing, borderRadius, fonts} from '@styles/theme';
import {useGlobalStyles} from '@styles/globalStyles';
import {useTheme} from '@context/ThemeContext';
import {useTaskContext} from '@context/TaskContext';
import {useProjectContext} from '@context/ProjectContext';
import Button from '@components/Button';
import {useTranslation} from '@i18n/i18n';
import { NavigationProp } from '@react-navigation/native';

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
  const {t} = useTranslation();
  const {categories} = useTaskContext();
  const {projects} = useProjectContext();
  const [tempFilter, setTempFilter] = useState<TaskFilter>(currentFilter);
  const styles = createStyles(colors);
  const globalStyles = useGlobalStyles();

  const statusOptions = [
    {value: 'all', label: t('common.all')},
    {value: 'pending', label: t('status.pending')},
    {value: 'completed', label: t('status.completed')},
  ];

  const priorityOptions = [
    {value: 'all', label: t('common.all')},
    {value: 'high', label: t('priority.high')},
    {value: 'medium', label: t('priority.medium')},
    {value: 'low', label: t('priority.low')},
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
      category_id: 'all',
      project_id: 'all',
      show_subtasks: true,
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
              <Text style={styles.modalTitle}>{t('taskList.filter')}</Text>
              <TouchableOpacity
                onPress={onClose}
                activeOpacity={0.7}
                hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}>
                <Icon name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('taskList.filterStatus')}</Text>
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
                <Text style={styles.sectionTitle}>{t('taskList.filterPriority')}</Text>
                <View style={styles.optionsContainer}>
                  {renderOption(priorityOptions, tempFilter.priority, value =>
                    setTempFilter({
                      ...tempFilter,
                      priority: value as 'low' | 'medium' | 'high' | 'all',
                    }),
                  )}
                </View>
              </View>
              
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('taskList.filterCategory')}</Text>
                <View style={styles.optionsContainer}>
                  {/* Tùy chọn 'Tất cả' cho danh mục */}
                  <TouchableOpacity
                    key="all"
                    style={[
                      styles.optionButton,
                      tempFilter.category_id === 'all' && styles.selectedOption,
                    ]}
                    onPress={() => setTempFilter({
                      ...tempFilter,
                      category_id: 'all',
                    })}
                    activeOpacity={0.7}>
                    <Text
                      style={[
                        styles.optionText,
                        tempFilter.category_id === 'all' && styles.selectedOptionText,
                      ]}>
                      {t('common.all')}
                    </Text>
                    {tempFilter.category_id === 'all' && (
                      <Icon name="checkmark" size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                  
                  {/* Tùy chọn 'Không có danh mục' */}
                  <TouchableOpacity
                    key="none"
                    style={[
                      styles.optionButton,
                      tempFilter.category_id === 'none' && styles.selectedOption,
                    ]}
                    onPress={() => setTempFilter({
                      ...tempFilter,
                      category_id: 'none',
                    })}
                    activeOpacity={0.7}>
                    <Text
                      style={[
                        styles.optionText,
                        tempFilter.category_id === 'none' && styles.selectedOptionText,
                      ]}>
                      {t('taskDetail.noCategory')}
                    </Text>
                    {tempFilter.category_id === 'none' && (
                      <Icon name="checkmark" size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                  
                  {/* Danh sách các danh mục */}
                  {categories.map(category => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.optionButton,
                        category.id && tempFilter.category_id === category.id.toString() ? styles.selectedOption : undefined,
                      ]}
                      onPress={() => category.id && setTempFilter({
                        ...tempFilter,
                        category_id: category.id.toString(),
                      })}
                      activeOpacity={0.7}>
                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View 
                          style={{
                            width: 12, 
                            height: 12, 
                            borderRadius: 6, 
                            backgroundColor: category.color,
                            marginRight: spacing.sm
                          }} 
                        />
                        <Text
                          style={[
                            styles.optionText,
                            category.id && tempFilter.category_id === category.id.toString() ? styles.selectedOptionText : undefined,
                          ]}>
                          {category.name}
                        </Text>
                      </View>
                      {category.id && tempFilter.category_id === category.id.toString() ? (
                        <Icon name="checkmark" size={20} color={colors.primary} />
                      ) : null}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('taskList.filterProject')}</Text>
                <View style={styles.optionsContainer}>
                  {/* Tùy chọn 'Tất cả' cho dự án */}
                  <TouchableOpacity
                    key="all-projects"
                    style={[
                      styles.optionButton,
                      tempFilter.project_id === 'all' && styles.selectedOption,
                    ]}
                    onPress={() => setTempFilter({
                      ...tempFilter,
                      project_id: 'all',
                    })}
                    activeOpacity={0.7}>
                    <Text
                      style={[
                        styles.optionText,
                        tempFilter.project_id === 'all' && styles.selectedOptionText,
                      ]}>
                      {t('common.all')}
                    </Text>
                    {tempFilter.project_id === 'all' && (
                      <Icon name="checkmark" size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                  
                  {/* Tùy chọn 'Không có dự án' */}
                  <TouchableOpacity
                    key="none-project"
                    style={[
                      styles.optionButton,
                      tempFilter.project_id === 'none' && styles.selectedOption,
                    ]}
                    onPress={() => setTempFilter({
                      ...tempFilter,
                      project_id: 'none',
                    })}
                    activeOpacity={0.7}>
                    <Text
                      style={[
                        styles.optionText,
                        tempFilter.project_id === 'none' && styles.selectedOptionText,
                      ]}>
                      {t('taskDetail.noProject')}
                    </Text>
                    {tempFilter.project_id === 'none' && (
                      <Icon name="checkmark" size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                  
                  {/* Danh sách các dự án */}
                  {projects.map(project => (
                    <TouchableOpacity
                      key={project.id}
                      style={[
                        styles.optionButton,
                        project.id && tempFilter.project_id === project.id.toString() ? styles.selectedOption : undefined,
                      ]}
                      onPress={() => project.id && setTempFilter({
                        ...tempFilter,
                        project_id: project.id.toString(),
                      })}
                      activeOpacity={0.7}>
                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View 
                          style={{
                            width: 12, 
                            height: 12, 
                            borderRadius: 6, 
                            backgroundColor: project.color,
                            marginRight: spacing.sm
                          }} 
                        />
                        <Text
                          style={[
                            styles.optionText,
                            project.id && tempFilter.project_id === project.id.toString() ? styles.selectedOptionText : undefined,
                          ]}>
                          {project.name}
                        </Text>
                      </View>
                      {project.id && tempFilter.project_id === project.id.toString() ? (
                        <Icon name="checkmark" size={20} color={colors.primary} />
                      ) : null}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('taskList.subtaskOptions')}</Text>
                <View style={styles.optionsContainer}>
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      tempFilter.show_subtasks && styles.selectedOption,
                    ]}
                    onPress={() => setTempFilter({
                      ...tempFilter,
                      show_subtasks: true,
                    })}
                    activeOpacity={0.7}>
                    <Text
                      style={[
                        styles.optionText,
                        tempFilter.show_subtasks && styles.selectedOptionText,
                      ]}>
                      {t('taskList.showAllTasks')}
                    </Text>
                    {tempFilter.show_subtasks && (
                      <Icon name="checkmark" size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      !tempFilter.show_subtasks && styles.selectedOption,
                    ]}
                    onPress={() => setTempFilter({
                      ...tempFilter,
                      show_subtasks: false,
                    })}
                    activeOpacity={0.7}>
                    <Text
                      style={[
                        styles.optionText,
                        !tempFilter.show_subtasks && styles.selectedOptionText,
                      ]}>
                      {t('taskList.hideSubtasks')}
                    </Text>
                    {!tempFilter.show_subtasks && (
                      <Icon name="checkmark" size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
              <Button
                title={t('common.reset')}
                variant="secondary"
                style={styles.button}
                onPress={handleReset}
              />

              <Button
                title={t('common.apply')}
                variant="primary"
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
