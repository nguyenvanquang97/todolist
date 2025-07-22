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
import { colors, spacing, borderRadius, fonts } from '../styles/theme';
import { globalStyles } from '../styles/globalStyles';

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
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return colors.priority.high;
      case 'medium':
        return colors.priority.medium;
      case 'low':
        return colors.priority.low;
      default:
        return colors.gray[400];
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
    return status === 'completed' ? colors.success : colors.gray[400];
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
        task.status === 'completed' && styles.completedTask,
        isOverdue && styles.overdueTask,
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
                task.status === 'completed' && styles.completedText,
              ]}
              numberOfLines={2}
            >
              {task.title}
            </Text>
            
            {task.description && (
              <Text
                style={[
                  styles.description,
                  task.status === 'completed' && styles.completedText,
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
                color={isOverdue ? colors.danger : colors.gray[500]}
              />
              <Text
                style={[
                  styles.dueDate,
                  isOverdue && styles.overdueDateText,
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
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.xs,
    marginHorizontal: spacing.md,
    shadowColor: colors.black,
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
  overdueTask: {
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
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
    fontWeight: '600',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: fonts.sizes.sm,
    color: colors.gray[600],
    lineHeight: 20,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.gray[500],
  },
  deleteButton: {
    padding: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badges: {
    flexDirection: 'row',
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
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  statusText: {
    fontSize: fonts.sizes.xs,
    fontWeight: '600',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: fonts.sizes.xs,
    color: colors.gray[500],
    marginLeft: spacing.xs,
  },
  overdueDateText: {
    color: colors.danger,
    fontWeight: '600',
  },
});

export default TaskItem;