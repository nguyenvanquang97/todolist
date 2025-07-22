import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import { TaskStackParamList } from '@navigation/AppNavigator';
import { useTaskContext } from '@context/TaskContext';
import { Task } from '../types/Task';
import LoadingSpinner from '@components/LoadingSpinner';
import Button from '@components/Button';
import { globalStyles } from '@styles/globalStyles';
import { spacing, borderRadius, fonts } from '@styles/theme';
import { useTheme } from '@context/ThemeContext';

// Define base colors for use in the component
const baseColors = {
  white: '#FFFFFF'
};

type AddEditTaskScreenNavigationProp = StackNavigationProp<TaskStackParamList, 'AddEditTask'>;
type AddEditTaskScreenRouteProp = RouteProp<TaskStackParamList, 'AddEditTask'>;

interface Props {
  navigation: AddEditTaskScreenNavigationProp;
  route: AddEditTaskScreenRouteProp;
}

const AddEditTaskScreen: React.FC<Props> = ({ navigation, route }) => {
  const { mode, task } = route.params;
  const { addTask, updateTask, loading } = useTaskContext();
  const { colors } = useTheme();

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(task?.priority || 'medium');
  const [dueDate, setDueDate] = useState<Date | null>(
    task?.due_date ? new Date(task.due_date) : null
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isEditMode = mode === 'edit';

    const validateForm = useCallback((): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Tiêu đề không được để trống';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Tiêu đề phải có ít nhất 3 ký tự';
    }

    if (description.trim().length > 500) {
      newErrors.description = 'Mô tả không được vượt quá 500 ký tự';
    }

    if (dueDate && dueDate < new Date()) {
      newErrors.dueDate = 'Ngày đến hạn không thể là ngày trong quá khứ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [title, description, dueDate]);


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
      };

      if (isEditMode && task) {
        await updateTask(task.id!, taskData);
        Alert.alert('Thành công', 'Công việc đã được cập nhật', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        await addTask({
          ...taskData,
          status: 'pending',
          createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        } as Task);
        Alert.alert('Thành công', 'Công việc đã được thêm', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu công việc. Vui lòng thử lại.');
    }
  }, [validateForm, title, description, priority, dueDate, isEditMode, task, updateTask, addTask, navigation]);


  useEffect(() => {
    navigation.setOptions({
      title: isEditMode ? 'Chỉnh sửa công việc' : 'Thêm công việc mới',
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 15 }}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={{ color: baseColors.white, fontSize: 16, fontWeight: '600' }}>
            {loading ? 'Đang lưu...' : 'Lưu'}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, isEditMode, loading, title, description, priority, dueDate, handleSave]);

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
    { value: 'low', label: 'Thấp', color: colors.success, icon: 'arrow-down' },
    { value: 'medium', label: 'Trung bình', color: colors.warning, icon: 'remove' },
    { value: 'high', label: 'Cao', color: colors.error, icon: 'arrow-up' },
  ];

  if (loading) {
    return <LoadingSpinner text={isEditMode ? 'Đang cập nhật...' : 'Đang thêm công việc...'} />;
  }

  return (
    <ScrollView contentContainerStyle={{ paddingVertical: spacing.lg }}
    style={[globalStyles.container, { paddingHorizontal: spacing.md, backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
        {/* Title Input */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text style={globalStyles.label}>Tiêu đề *</Text>
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
            placeholder="Nhập tiêu đề công việc"
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
          <Text style={globalStyles.label}>Mô tả</Text>
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
            placeholder="Nhập mô tả chi tiết (tùy chọn)"
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
          <Text style={globalStyles.label}>Mức độ ưu tiên</Text>
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
          <Text style={globalStyles.label}>Ngày đến hạn</Text>
          <TouchableOpacity
            style={[
              {
                backgroundColor: colors.surface,
                borderRadius: borderRadius.md,
                paddingVertical: spacing.md,
                paddingHorizontal: spacing.md,
                borderWidth: 1,
                borderColor: colors.border,
                flexDirection:"row",
                alignItems:"center"
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
                  : 'Chọn ngày đến hạn'}
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

        {/* Save Button */}
        <Button
          title={isEditMode ? 'Cập nhật công việc' : 'Thêm công việc'}
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
        cancelTextIOS="Hủy"
        confirmTextIOS="Xác nhận"
      />
    </ScrollView>
  );
};

export default AddEditTaskScreen;