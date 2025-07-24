import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {Task} from '../types/Task';
import {spacing, borderRadius, fonts, baseColors} from '@styles/theme';
import {useTheme} from '@context/ThemeContext';
import {useTranslation} from '@i18n/i18n';
import {useTaskContext} from '@context/TaskContext';
import {useProjectContext} from '@context/ProjectContext';

export interface TaskItemProps {
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
  const {colors} = useTheme();
  const {t} = useTranslation();
  const {categories, getSubtasks} = useTaskContext();
  const {projects} = useProjectContext();
  const [subtasks, setSubtasks] = React.useState<Task[]>([]);
  
  React.useEffect(() => {
    if (task.id) {
      const loadSubtasks = async () => {
        const tasks = await getSubtasks(task.id!);
        setSubtasks(tasks);
      };
      loadSubtasks();
    }
  }, [task.id, getSubtasks]);
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
        return t('priority.high');
      case 'medium':
        return t('priority.medium');
      case 'low':
        return t('priority.low');
      default:
        return t('priority.undefined');
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
      t('taskList.deleteConfirmTitle'),
      t('taskList.deleteConfirmMessage'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => onDelete(task.id!),
        },
      ],
    );
  };

  const isOverdue =
    task.due_date &&
    moment(task.due_date).isBefore(moment(), 'day') &&
    task.status === 'pending';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {backgroundColor: colors.card},
        task.status === 'completed' && styles.completedTask,
        isOverdue && {borderLeftWidth: 4, borderLeftColor: colors.danger},
      ]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleToggleStatus}
            style={styles.statusButton}>
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
                {color: colors.text},
                task.status === 'completed' && {
                  textDecorationLine: 'line-through',
                  color: colors.textDisabled,
                },
              ]}
              numberOfLines={2}>
              {task.title}
            </Text>

            {task.description && (
              <Text
                style={[
                  styles.description,
                  {color: colors.textSecondary},
                  task.status === 'completed' && {
                    textDecorationLine: 'line-through',
                    color: colors.textDisabled,
                  },
                ]}
                numberOfLines={2}>
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
                {backgroundColor: getPriorityColor(task.priority) + '20'},
              ]}>
              <Text
                style={[
                  styles.priorityText,
                  {color: getPriorityColor(task.priority)},
                ]}>
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
              ]}>
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      task.status === 'completed'
                        ? colors.success
                        : colors.warning,
                  },
                ]}>
                {task.status === 'completed'
                  ? t('status.completed')
                  : t('status.pending')}
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
                  {color: colors.textSecondary},
                  isOverdue && {color: colors.danger, fontWeight: '600'},
                ]}>
                {moment(task.due_date).format('DD/MM/YYYY')}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.tagContainer}>
          {/* Category Badge */}
          {task.category_id &&
            categories.map(category => {
              if (category.id === task.category_id) {
                return (
                  <View
                    key={category.id}
                    style={[
                      styles.categoryBadge,
                      {backgroundColor: category.color + '20'},
                    ]}>
                    <View
                      style={[
                        styles.categoryDot,
                        {backgroundColor: category.color},
                      ]}
                    />
                    <Text
                      style={[styles.categoryText, {color: category.color}]}
                      numberOfLines={1}>
                      {category.name}
                    </Text>
                  </View>
                );
              }
              return null;
            })}
            
          {/* Project Badge */}
          {task.project_id &&
            projects.map(project => {
              if (project.id === task.project_id) {
                return (
                  <View
                    key={project.id}
                    style={[
                      styles.projectBadge,
                      {backgroundColor: project.color + '20'},
                    ]}>
                    <Icon name="folder-outline" size={12} color={project.color} />
                    <Text
                      style={[styles.projectText, {color: project.color}]}
                      numberOfLines={1}>
                      {project.name}
                    </Text>
                  </View>
                );
              }
              return null;
            })}
            
          {/* Parent Task Badge */}
          {task.parent_task_id && (
            <View
              style={[
                styles.subtaskBadge,
                {backgroundColor: colors.primary + '20'},
              ]}>
              <Icon name="git-branch-outline" size={12} color={colors.primary} />
              <Text
                style={[styles.subtaskText, {color: colors.primary}]}
                numberOfLines={1}>
                {t('taskItem.subtask')}
              </Text>
            </View>
          )}
          
          {/* Subtasks Badge */}
          {subtasks.length > 0 && (
            <View
              style={[
                styles.subtaskBadge,
                {backgroundColor: colors.info + '20'},
              ]}>
              <Icon name="git-network-outline" size={12} color={colors.info} />
              <Text
                style={[styles.subtaskText, {color: colors.info}]}
                numberOfLines={1}>
                {t('taskItem.hasSubtasks', {count: subtasks.length})}
              </Text>
            </View>
          )}
          
          {/* Completion Percentage */}
          {task.completion_percentage !== undefined && task.completion_percentage > 0 && (
            <View
              style={[
                styles.progressBadge,
                {backgroundColor: colors.success + '20'},
              ]}>
              <Icon name="pie-chart-outline" size={12} color={colors.success} />
              <Text
                style={[styles.progressText, {color: colors.success}]}
                numberOfLines={1}>
                {task.completion_percentage}%
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
  tagContainer: {
    marginTop: spacing.sm,
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: spacing.sm,
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
  categoryBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,

  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  categoryText: {
    fontSize: fonts.sizes.xs,
    fontWeight: '600' as const,
    maxWidth: 80,
  },
  projectBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  projectText: {
    fontSize: fonts.sizes.xs,
    fontWeight: '600' as const,
    maxWidth: 80,
    marginLeft: spacing.xs,
  },
  subtaskBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  subtaskText: {
    fontSize: fonts.sizes.xs,
    fontWeight: '600' as const,
    maxWidth: 80,
    marginLeft: spacing.xs,
  },
  progressBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  progressText: {
    fontSize: fonts.sizes.xs,
    fontWeight: '600' as const,
    marginLeft: spacing.xs,
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
