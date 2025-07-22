import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import { Task } from '../types/Task';
import { spacing, borderRadius, fonts, baseColors } from '@styles/theme';
import { useTheme } from '@context/ThemeContext';

interface TaskItemProps {
  task: Task;
  onPress: () => void;
  onToggleStatus: (id: number, status: 'pending' | 'completed') => void;
  onDelete: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onPress,
  onToggleStatus,
  onDelete,
}) => {
  const { colors } = useTheme();
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return colors.priority.high;
      case 'medium':
        return colors.priority.medium;
      case 'low':
        return colors.priority.low;
      default:
        return baseColors.gray[400];
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Cao';
      case 'medium':
        return 'Trung bình';
      case 'low':
        return 'Thấp';
      default:
        return priority;
    }
  };

  const getStatusIcon = (status: string) => {
    return status === 'completed' ? 'checkmark-circle' : 'ellipse-outline';
  };

  const getStatusColor = (status: string) => {
    return status === 'completed' ? colors.success : baseColors.gray[400];
  };

  const handleToggleStatus = () => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    onToggleStatus(task.id!, newStatus);
  };

  const handleDelete = () => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa công việc này?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => onDelete(task.id!),
        },
      ]
    );
  };

  const isOverdue = task.due_date && moment(task.due_date).isBefore(moment(), 'day') && task.status === 'pending';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: colors.card },
        task.status === 'completed' && styles.completedTask,
        isOverdue && { borderLeftWidth: 4, borderLeftColor: colors.danger },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleToggleStatus} style={styles.statusButton}>
            <Icon
              name={getStatusIcon(task.status)}
              size={24}
              color={getStatusColor(task.status)}
            />
          </TouchableOpacity>
          
          <View style={styles.taskInfo}>
            <Text
              style={[
                styles.title,
                { color: colors.text },
                task.status === 'completed' && { 
                  textDecorationLine: 'line-through',
                  color: colors.textDisabled 
                },
              ]}
              numberOfLines={2}
            >
              {task.title}
            </Text>
            
            {task.description && (
              <Text
                style={[
                  styles.description,
                  { color: colors.textSecondary },
                  task.status === 'completed' && { 
                    textDecorationLine: 'line-through',
                    color: colors.textDisabled 
                  },
                ]}
                numberOfLines={2}
              >
                {task.description}
              </Text>
            )}
          </View>

          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Icon name="trash-outline" size={20} color={colors.danger} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <View style={styles.badges}>
            <View
              style={[
                styles.priorityBadge,
                { backgroundColor: getPriorityColor(task.priority) + '20' },
              ]}
            >
              <Text
                style={[
                  styles.priorityText,
                  { color: getPriorityColor(task.priority) },
                ]}
              >
                {getPriorityText(task.priority)}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    task.status === 'completed'
                      ? colors.success + '20'
                      : colors.warning + '20',
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      task.status === 'completed'
                        ? colors.success
                        : colors.warning,
                  },
                ]}
              >
                {task.status === 'completed' ? 'Hoàn thành' : 'Chưa hoàn thành'}
              </Text>
            </View>
          </View>

          {task.due_date && (
            <View style={styles.dueDateContainer}>
              <Icon
                name="calendar-outline"
                size={14}
                color={isOverdue ? colors.danger : colors.textSecondary}
              />
              <Text
                style={[
                  styles.dueDate,
                  { color: colors.textSecondary },
                  isOverdue && { color: colors.danger, fontWeight: '600' },
                ]}
              >
                {moment(task.due_date).format('DD/MM/YYYY')}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.xs,
    marginHorizontal: spacing.md,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  completedTask: {
    opacity: 0.7,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  statusButton: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  taskInfo: {
    flex: 1,
  },
  title: {
    fontSize: fonts.sizes.md,
    fontWeight: '600' as const,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: fonts.sizes.sm,
    lineHeight: 20,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  footer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  badges: {
    flexDirection: 'row' as const,
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  priorityText: {
    fontSize: fonts.sizes.xs,
    fontWeight: '600' as const,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  statusText: {
    fontSize: fonts.sizes.xs,
    fontWeight: '600' as const,
  },
  dueDateContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  dueDate: {
    fontSize: fonts.sizes.xs,
    marginLeft: spacing.xs,
  },
});

export default TaskItem;