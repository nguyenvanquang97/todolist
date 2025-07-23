import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import { RootStackParamList } from '@navigation/RootStackNavigator';
import { useTaskContext } from '@context/TaskContext';
import { Task, Category, Tag } from '../types/Task';
import LoadingSpinner from '@components/LoadingSpinner';
import Button from '@components/Button';
import { globalStyles } from '@styles/globalStyles';
import { spacing, borderRadius, fonts } from '@styles/theme';
import { useTheme } from '@context/ThemeContext';
import { useTranslation } from '@i18n/i18n';
import { TranslationKey } from '@i18n/types';


// Define base colors for use in the component
const baseColors = {
  white: '#FFFFFF',
};

type AddEditTaskScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddEditTask'>;
type AddEditTaskScreenRouteProp = RouteProp<RootStackParamList, 'AddEditTask'>;

interface Props {
  navigation: AddEditTaskScreenNavigationProp;
  route: AddEditTaskScreenRouteProp;
}

const AddEditTaskScreen: React.FC<Props> = ({ navigation, route }) => {
  const { mode, task } = route.params;
  const { addTask, updateTask, loading, categories, tags, getTagsForTask } = useTaskContext();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const {addTagToTask,removeTagFromTask} = useTaskContext();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(task?.priority || 'medium');
  const [dueDate, setDueDate] = useState<Date | null>(
    task?.due_date ? new Date(task.due_date) : null
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  
  const isEditMode = mode === 'edit';

    const validateForm = useCallback((): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = t('addEditTask.errors.emptyTitle');
    } else if (title.trim().length < 3) {
      newErrors.title = t('addEditTask.errors.titleTooShort');
    }

    if (description.trim().length > 500) {
      newErrors.description = t('addEditTask.errors.descriptionTooLong');
    }

    if (dueDate && dueDate < new Date()) {
      newErrors.dueDate = t('addEditTask.errors.pastDueDate');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [title, description, dueDate, t]);

  const handleSave = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const taskData: Partial<Task> = {
        title: title.trim(),
        description: description.trim(),
        priority,
        due_date: dueDate ? moment(dueDate).format('YYYY-MM-DD HH:mm:ss') : undefined,
        category_id: selectedCategory?.id,
      };

      if (isEditMode && task) {
        // Update task
        if (task.id !== undefined) {
          await updateTask(task.id, taskData);
        }
        
        // Update tags
        if (selectedTags.length > 0) {
          // First, get current tags to determine what to add/remove
          if (task.id !== undefined) {
            const currentTags = await getTagsForTask(task.id);
            const currentTagIds = currentTags.map(t => t.id !== undefined ? t.id : -1);
            const selectedTagIds = selectedTags.map(t => t.id !== undefined ? t.id : -1);
          
            // Remove tags that are no longer selected
            for (const currentTag of currentTags) {
              if (currentTag.id !== undefined && task.id !== undefined && !selectedTagIds.includes(currentTag.id)) {
                await removeTagFromTask(task.id, currentTag.id);
              }
            }
            
            // Add newly selected tags
            for (const selectedTag of selectedTags) {
              if (selectedTag.id !== undefined && task.id !== undefined && !currentTagIds.includes(selectedTag.id)) {
                await addTagToTask(task.id, selectedTag.id);
              }
            }
          }
        }
        
        Alert.alert(t('common.success'), t('addEditTask.updateSuccess'), [
          { text: t('common.ok'), onPress: () => navigation.goBack() },
        ]);
      } else {
        // Add new task
        await addTask({
          ...taskData,
          status: 'pending',
          createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        } as Task);
        
        // Không thể thêm tag vào task mới ở đây vì addTask không trả về task ID
        // Cần cải thiện logic này trong tương lai
        
        Alert.alert(t('common.success'), t('addEditTask.addSuccess'), [
          { text: t('common.ok'), onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('addEditTask.saveError'));
    }
  }, [validateForm, title, description, priority, dueDate, selectedCategory, selectedTags, isEditMode, task, updateTask, addTask, getTagsForTask, addTagToTask, removeTagFromTask, navigation, t]);


  useEffect(() => {
    navigation.setOptions({
      title: isEditMode ? t('addEditTask.editTitle') : t('addEditTask.addTitle'),
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 15 }}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={{ color: baseColors.white, fontSize: 16, fontWeight: '600' }}>
            {loading ? t('common.saving') : t('common.save')}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, isEditMode, loading, title, description, priority, dueDate, handleSave, t]);
  
  // Load category and tags if in edit mode
  useEffect(() => {
    if (isEditMode && task) {
      // Load category
      if (task.category_id) {
        const category = categories.find(c => c.id === task.category_id);
        if (category) {
          setSelectedCategory(category);
        }
      }
      
      // Load tags
      const loadTags = async () => {
        if (task.id) {
          try {
            const taskTags = await getTagsForTask(task.id);
            setSelectedTags(taskTags);
          } catch (error) {
            console.error('Failed to load tags for task', error);
          }
        }
      };
      
      loadTags();
    }
  }, [isEditMode, task, categories, getTagsForTask]);

  const handleDateChange = (selectedDate: Date) => {
    setShowDatePicker(false);
    setDueDate(selectedDate);
    if (errors.dueDate) {
      setErrors({ ...errors, dueDate: '' });
    }
  };

  const handleDateCancel = () => {
    setShowDatePicker(false);
  };

  const clearDueDate = () => {
    setDueDate(null);
    if (errors.dueDate) {
      setErrors({ ...errors, dueDate: '' });
    }
  };

  const priorityOptions = [
    { value: 'low', label: t('priority.low'), color: colors.success, icon: 'arrow-down' },
    { value: 'medium', label: t('priority.medium'), color: colors.warning, icon: 'remove' },
    { value: 'high', label: t('priority.high'), color: colors.error, icon: 'arrow-up' },
  ];

  if (loading) {
    return <LoadingSpinner text={isEditMode ? t('common.updating') : t('addEditTask.adding')} />;
  }

  return (
    <ScrollView contentContainerStyle={{ paddingVertical: spacing.lg }}
    style={[globalStyles.container, { paddingHorizontal: spacing.md, backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
        {/* Title Input */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text style={globalStyles.label}>{t('addEditTask.titleLabel')} *</Text>
          <TextInput
            style={[
              globalStyles.input,
              errors.title && globalStyles.inputError,
            ]}
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (errors.title) {
                setErrors({ ...errors, title: '' });
              }
            }}
            placeholder={t('addEditTask.titlePlaceholder')}
            placeholderTextColor={colors.textDisabled}
            maxLength={100}
          />
          {errors.title && (
            <Text style={[globalStyles.caption, { color: colors.danger }]}>
              {errors.title}
            </Text>
          )}


        {/* Description Input */}
        <View style={globalStyles.inputGroup}>
          <Text style={globalStyles.label}>{t('addEditTask.descriptionLabel')}</Text>
          <TextInput
            style={[
              globalStyles.input,
              { height: 100, textAlignVertical: 'top', paddingTop: spacing.md },
              errors.description && globalStyles.inputError,
            ]}
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              if (errors.description) {
                setErrors({ ...errors, description: '' });
              }
            }}
            placeholder={t('addEditTask.descriptionPlaceholder')}
            placeholderTextColor={colors.textDisabled}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={{ fontSize: fonts.sizes?.sm || 12, color: colors.textDisabled, textAlign: 'right', marginTop: spacing.xs }}>
            {description.length}/500
          </Text>
          {errors.description && (
            <Text style={globalStyles.errorText}>{errors.description}</Text>
          )}
        </View>

        {/* Priority Selection */}
        <View style={globalStyles.inputGroup}>
          <Text style={globalStyles.label}>{t('addEditTask.priorityLabel')}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm }}>
            {priorityOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  { flex: 1, marginHorizontal: spacing.xs, padding: spacing.sm, borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
                  priority === option.value && {
                    backgroundColor: option.color + '20',
                    borderColor: option.color,
                  },
                ]}
                onPress={() => setPriority(option.value as 'low' | 'medium' | 'high')}
              >
                <Icon
                  name={option.icon}
                  size={20}
                  color={priority === option.value ? option.color : colors.textDisabled}
                />
                <Text
                  style={[
                    globalStyles.priorityText,
                    priority === option.value && { color: option.color },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Due Date Selection */}
        <View style={globalStyles.inputGroup}>
          <Text style={globalStyles.label}>{t('addEditTask.dueDateLabel')}</Text>
          <TouchableOpacity
            style={[
              {
                backgroundColor: colors.surface,
                borderRadius: borderRadius.md,
                paddingVertical: spacing.md,
                paddingHorizontal: spacing.md,
                borderWidth: 1,
                borderColor: colors.border,
                flexDirection:'row',
                alignItems:'center',
              },
              errors.dueDate && globalStyles.inputError,
            ]}
            onPress={() => setShowDatePicker(true)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1,gap:spacing.sm }}>
              <Icon name="calendar-outline" size={20} color={colors.textSecondary} />
              <Text
                style={[
                  { fontSize: fonts.sizes?.md || 16, color: colors.text },
                  !dueDate && { color: colors.textDisabled },
                ]}
              >
                {dueDate
                  ? moment(dueDate).format('DD/MM/YYYY HH:mm')
                  : t('addEditTask.selectDueDate')}
              </Text>
            </View>
            {dueDate && (
              <TouchableOpacity onPress={clearDueDate}>
                <Icon name="close-circle" size={20} color={colors.textDisabled} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
          {errors.dueDate && (
            <Text style={globalStyles.errorText}>{errors.dueDate}</Text>
          )}
        </View>

        {/* Category Selection */}
        <View style={globalStyles.inputGroup}>
          <Text style={globalStyles.label}>{t('addEditTask.categoryLabel')}</Text>
          <TouchableOpacity
            style={[{
              backgroundColor: colors.surface,
              borderRadius: borderRadius.md,
              paddingVertical: spacing.md,
              paddingHorizontal: spacing.md,
              borderWidth: 1,
              borderColor: colors.border,
              flexDirection: 'row',
              alignItems: 'center',
            }]}
            onPress={() => setShowCategoryModal(true)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: spacing.sm }}>
              {selectedCategory ? (
                <>
                  <View style={[{ width: 16, height: 16, borderRadius: 8 }, { backgroundColor: selectedCategory.color }]} />
                  <Text style={{ fontSize: fonts.sizes?.md || 16, color: colors.text }}>
                    {selectedCategory.name}
                  </Text>
                </>
              ) : (
                <>
                  <Icon name="folder-outline" size={20} color={colors.textSecondary} />
                  <Text style={{ fontSize: fonts.sizes?.md || 16, color: colors.textDisabled }}>
                    {t('addEditTask.selectCategory')}
                  </Text>
                </>
              )}
            </View>
            {selectedCategory && (
              <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                <Icon name="close-circle" size={20} color={colors.textDisabled} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </View>

        {/* Tags Selection */}
        <View style={globalStyles.inputGroup}>
          <Text style={globalStyles.label}>{t('addEditTask.tagsLabel')}</Text>
          <TouchableOpacity
            style={[{
              backgroundColor: colors.surface,
              borderRadius: borderRadius.md,
              paddingVertical: spacing.md,
              paddingHorizontal: spacing.md,
              borderWidth: 1,
              borderColor: colors.border,
              flexDirection: 'row',
              alignItems: 'center',
            }]}
            onPress={() => setShowTagModal(true)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: spacing.sm }}>
              <Icon name="pricetag-outline" size={20} color={colors.textSecondary} />
              <Text style={{ fontSize: fonts.sizes?.md || 16, color: selectedTags.length > 0 ? colors.text : colors.textDisabled }}>
                {selectedTags.length > 0 
                  ? `${selectedTags.length} ${t('addEditTask.tagsSelected')}`
                  : t('addEditTask.selectTags')}
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          {selectedTags.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.sm, gap: spacing.xs }}>
              {selectedTags.map(tag => (
                <View key={tag.id} style={[{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: tag.color + '30',
                  paddingVertical: spacing.xs,
                  paddingHorizontal: spacing.sm,
                  borderRadius: borderRadius.full,
                  marginBottom: spacing.xs,
                }]}>
                  <Text style={{ color: tag.color, fontSize: fonts.sizes?.sm || 12, marginRight: spacing.xs }}>
                    {tag.name}
                  </Text>
                  <TouchableOpacity onPress={() => setSelectedTags(prev => prev.filter(t => t.id !== tag.id))}>
                    <Icon name="close-circle" size={16} color={tag.color} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Save Button */}
        <Button
          title={isEditMode ? t('addEditTask.updateButton') : t('addEditTask.addButton')}
          style={{ marginTop: spacing.xl }}
          onPress={handleSave}
          disabled={!title.trim() || loading}
          loading={loading}
        />
      </View>

      {/* Date Picker Modal */}
      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="datetime"
        date={dueDate || new Date()}
        minimumDate={new Date()}
        onConfirm={handleDateChange}
        onCancel={handleDateCancel}
        cancelTextIOS={t('common.cancel')}
        confirmTextIOS={t('common.confirm')}
      />
      
      {/* Category Selection Modal */}
      <Modal
        visible={showCategoryModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCategoryModal(false)}
        >
          <View
            style={[styles.modalContent, { backgroundColor: colors.card }]}
            onStartShouldSetResponder={() => true}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {t('addEditTask.selectCategory')}
            </Text>
            
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id !== undefined ? item.id.toString() : 'temp-' + item.name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.categoryOption, selectedCategory?.id === item.id && styles.selectedOption]}
                  onPress={() => {
                    setSelectedCategory(item);
                    setShowCategoryModal(false);
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[{ width: 16, height: 16, borderRadius: 8, marginRight: spacing.sm }, { backgroundColor: item.color }]} />
                    <Text style={[styles.optionText, { color: colors.text }]}>{item.name}</Text>
                  </View>
                  {selectedCategory?.id === item.id && (
                    <Icon name="checkmark" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  {t('addEditTask.noCategories')}
                </Text>
              }
            />
            
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowCategoryModal(false)}
            >
              <Text style={styles.closeButtonText}>{t('common.close' as TranslationKey)}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      
      {/* Tags Selection Modal */}
      <Modal
        visible={showTagModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTagModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowTagModal(false)}
        >
          <View
            style={[styles.modalContent, { backgroundColor: colors.card }]}
            onStartShouldSetResponder={() => true}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {t('addEditTask.selectTags')}
            </Text>
            
            <FlatList
              data={tags}
              keyExtractor={(item) => item.id !== undefined ? item.id.toString() : 'temp-' + item.name}
              renderItem={({ item }) => {
                const isSelected = selectedTags.some(tag => tag.id === item.id);
                return (
                  <TouchableOpacity
                    style={[styles.tagOption, isSelected && { backgroundColor: item.color + '20' }]}
                    onPress={() => {
                      if (isSelected) {
                        setSelectedTags(prev => prev.filter(tag => tag.id !== item.id));
                      } else {
                        setSelectedTags(prev => [...prev, item]);
                      }
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={[{ width: 16, height: 16, borderRadius: 8, marginRight: spacing.sm }, { backgroundColor: item.color }]} />
                      <Text style={[styles.optionText, { color: colors.text }]}>{item.name}</Text>
                    </View>
                    {isSelected && (
                      <Icon name="checkmark" size={20} color={item.color} />
                    )}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  {t('addEditTask.noTags')}
                </Text>
              }
            />
            
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowTagModal(false)}
            >
              <Text style={styles.closeButtonText}>{t('common.done' as TranslationKey)}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

// Add styles for modals
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    maxHeight: '80%',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  modalTitle: {
    fontSize: fonts.sizes?.lg || 18,
    fontWeight: '600',
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  tagOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  selectedOption: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
  },
  optionText: {
    fontSize: fonts.sizes?.md || 16,
  },
  emptyText: {
    textAlign: 'center',
    padding: spacing.lg,
    fontStyle: 'italic',
  },
  closeButton: {
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: baseColors.white,
    fontSize: fonts.sizes?.md || 16,
    fontWeight: '600',
  },
});

export default AddEditTaskScreen;
