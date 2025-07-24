import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  StyleSheet,
  ToastAndroid,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Button from '@components/Button';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import { RootStackParamList } from '@navigation/RootStackNavigator';
import { useTaskContext } from '@context/TaskContext';
import { useProjectContext } from '@context/ProjectContext';
import { Task, Tag } from '../types/Task';
import LoadingSpinner from '@components/LoadingSpinner';
import { globalStyles } from '@styles/globalStyles';
import { spacing, borderRadius, fonts } from '@styles/theme';
import { useTheme } from '@context/ThemeContext';
import { testNotification } from '@utils/notificationHelper';
import { useTranslation } from '@i18n/i18n';
import SubtaskList from '@/components/task/SubtaskList';


// Define base colors for use in the component
const baseColors = {
  white: '#FFFFFF',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
  },
};

type TaskDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TaskDetail'>;
type TaskDetailScreenRouteProp = RouteProp<RootStackParamList, 'TaskDetail'>;

interface Props {
  navigation: TaskDetailScreenNavigationProp;
  route: TaskDetailScreenRouteProp;
}

const TaskDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { task: initialTask } = route.params;
  const { updateTask, deleteTask, loading, categories, getTagsForTask, getSubtasks, updateTaskCompletion } = useTaskContext();
  const { projects } = useProjectContext();
  const { colors } = useTheme();
  const [task, setTask] = useState<Task>(initialTask);
  const [taskTags, setTaskTags] = useState<Tag[]>([]);
  const [loadingTags, setLoadingTags] = useState(false);
  const [subtasks, setSubtasks] = useState<Task[]>([]);
  const [parentTask, setParentTask] = useState<Task | null>(null);
  const [project, setProject] = useState<any | null>(null);
  const styles = createStyles(colors);

  console.log("taskTags", taskTags);

  const handleEdit = useCallback(() => {
    navigation.navigate('AddEditTask', {
      mode: 'edit',
      task,
    });
  }, [navigation, task]);

  const { t } = useTranslation();

  const handleDelete = useCallback(async () => {
    Alert.alert(
      t('taskDetail.deleteConfirmTitle'),
      t('taskDetail.deleteConfirmMessage'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              if (task.id !== undefined) {
                await deleteTask(task.id);
                navigation.goBack();
              }
            } catch (error) {
              Alert.alert(t('common.error'), t('taskDetail.deleteError'));
            }
          },
        },
      ]
    );
  }, [deleteTask, navigation, task, t]);

  // Cấu hình header buttons
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <Button
            icon="create-outline"
            variant="icon"
            onPress={handleEdit}
            style={{ marginRight: 15 }}
            iconColor={baseColors.white}
            iconSize={24}
          />
          <Button
            icon="trash-outline"
            variant="icon"
            onPress={handleDelete}
            style={{ marginRight: 15 }}
            iconColor={baseColors.white}
            iconSize={24}
          />
        </View>
      ),
    });
  }, [navigation, handleEdit, handleDelete]);
  
  // Load tags for the task - tách thành useEffect riêng
  useEffect(() => {
    const loadTags = async () => {
      setLoadingTags(true);
      try {
        if (task.id !== undefined) {
          const tags = await getTagsForTask(task.id);
          setTaskTags(tags);
          
          // Load project if task has project_id
          if (task.project_id) {
            const foundProject = projects.find(p => p.id === task.project_id);
            setProject(foundProject || null);
          }
          
          // Load parent task if this is a subtask
          if (task.parent_task_id) {
            const foundParentTask = tasks.find(t => t.id === task.parent_task_id);
            setParentTask(foundParentTask || null);
          }
          
          // Load subtasks
          loadSubtasks(task.id);
        }
      } catch (error) {
        console.error('Failed to load tags for task', error);
      } finally {
        setLoadingTags(false);
      }
    };
    
    loadTags();
  }, [task.id, projects]); // Loại bỏ getTagsForTask khỏi dependencies để tránh vòng lặp vô hạn
  
  const loadSubtasks = async (parentId: string) => {
    try {
      const subtaskList = await getSubtasks(parentId);
      setSubtasks(subtaskList);
    } catch (error) {
      console.error('Failed to load subtasks for task', error);
    }
  };

  const handleToggleStatus = async () => {
    try {
      if (task.id !== undefined) {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        const newCompletionPercentage = newStatus === 'completed' ? 100 : 0;
        
        await updateTask(task.id, { 
          status: newStatus,
          completion_percentage: newCompletionPercentage 
        });
        
        setTask({ ...task, status: newStatus, completion_percentage: newCompletionPercentage });
        
        // Update parent task completion if this is a subtask
        if (task.parent_task_id) {
          await updateTaskCompletion(task.parent_task_id);
        }
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('taskDetail.updateStatusError'));
    }
  };

  const handleTestNotification = async () => {
    try {
      await testNotification();
      if (Platform.OS === 'android') {
        ToastAndroid.show(t('taskDetail.notificationSent'), ToastAndroid.SHORT);
      } else {
        Alert.alert(t('common.notification'), t('taskDetail.notificationSent'));
      }
    } catch (error: unknown) {
      Alert.alert(t('common.error'), t('taskDetail.notificationError'));
    }
  };

  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case 'high':
        return { label: t('priority.high'), color: colors.error, icon: 'arrow-up' };
      case 'medium':
        return { label: t('priority.medium'), color: colors.warning, icon: 'remove' };
      case 'low':
        return { label: t('priority.low'), color: colors.success, icon: 'arrow-down' };
      default:
        return { label: t('priority.undefined'), color: colors.textSecondary, icon: 'help' };
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { label: t('status.completed'), color: colors.success, icon: 'checkmark-circle' };
      case 'pending':
        return { label: t('status.pending'), color: colors.warning, icon: 'time' };
      default:
        return { label: t('status.undefined'), color: colors.textSecondary, icon: 'help' };
    }
  };

  const isOverdue = task.due_date && moment(task.due_date).isBefore(moment()) && task.status === 'pending';
  const priorityInfo = getPriorityInfo(task.priority);
  const statusInfo = getStatusInfo(task.status);

  if (loading) {
    return <LoadingSpinner text={t('common.updating')} />;
  }

  return (
    <ScrollView style={[globalStyles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Status Badge */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '20' }]}>
            <Icon name={statusInfo.icon} size={16} color={statusInfo.color} />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.label}
            </Text>
          </View>
          {isOverdue && (
            <View style={[styles.statusBadge, { backgroundColor: colors.error + '20' }]}>
              <Icon name="warning" size={16} color={colors.error} />
              <Text style={[styles.statusText, { color: colors.error }]}>{t('taskDetail.overdue')}</Text>
            </View>
          )}
        </View>

        {/* Project and Parent Task Info */}
        <View style={styles.metaInfoContainer}>
          {project && (
            <TouchableOpacity 
              style={[styles.metaBadge, { backgroundColor: colors.primary + '20' }]}
              onPress={() => navigation.navigate('ProjectDetail', { projectId: project.id })}
            >
              <Icon name="folder-outline" size={14} color={colors.primary} />
              <Text style={[styles.metaText, { color: colors.primary }]}>{project.name}</Text>
            </TouchableOpacity>
          )}
          
          {parentTask && (
            <TouchableOpacity 
              style={[styles.metaBadge, { backgroundColor: colors.secondary + '20' }]}
              onPress={() => navigation.navigate('TaskDetail', { task: parentTask })}
            >
              <Icon name="git-merge-outline" size={14} color={colors.secondary} />
              <Text style={[styles.metaText, { color: colors.secondary }]}>{t('taskDetail.parentTask')}: {parentTask.title}</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Title */}
        <Text style={styles.title}>{task.title}</Text>
        
        {/* Completion Progress */}
        {task.completion_percentage !== undefined && (
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>
                {t('taskDetail.completion')}: {task.completion_percentage}%
              </Text>
            </View>
            <ProgressBar 
              progress={task.completion_percentage || 0} 
              height={8} 
              backgroundColor={colors.border}
              progressColor={colors.primary}
            />
          </View>
        )}

        {/* Description */}
        {task.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('taskDetail.description')}</Text>
            <Text style={styles.description}>{task.description}</Text>
          </View>
        )}
        
        {/* Category */}
        {task.category_id && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('taskDetail.category')}</Text>
            {categories.map(category => {
              if (category.id === task.category_id) {
                return (
                  <View key={category.id} style={[styles.categoryContainer, { backgroundColor: category.color + '20' }]}>
                    <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                    <Text style={[styles.categoryText, { color: category.color }]}>
                      {category.name}
                    </Text>
                    {category.icon && (
                      <Icon name={category.icon} size={16} color={category.color} style={styles.categoryIcon} />
                    )}
                  </View>
                );
              }
              return null;
            })}
          </View>
        )}
        
        {/* Tags */}
        {taskTags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('taskDetail.tags')}</Text>
            <View style={styles.tagsContainer}>
              {taskTags.map(tag => (
                <View key={tag.id} style={[styles.tagContainer, { backgroundColor: tag.color + '20' }]}>
                  <Text style={[styles.tagText, { color: tag.color }]}>
                    {tag.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Priority */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('taskDetail.priority')}</Text>
          <View style={[styles.priorityBadge, { backgroundColor: priorityInfo.color + '20' }]}>
            <Icon name={priorityInfo.icon} size={20} color={priorityInfo.color} />
            <Text style={[styles.priorityText, { color: priorityInfo.color }]}>
              {priorityInfo.label}
            </Text>
          </View>
        </View>

        {/* Due Date */}
        {task.due_date && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('taskDetail.dueDate')}</Text>
            <View style={styles.dateContainer}>
              <Icon name="calendar-outline" size={20} color={colors.textSecondary} />
              <Text style={[styles.dateText, isOverdue && { color: colors.error }]}>
                {moment(task.due_date).format('DD/MM/YYYY HH:mm')}
              </Text>
            </View>
            <Text style={[styles.relativeDateText, isOverdue && { color: colors.error }]}>
              {moment(task.due_date).fromNow()}
            </Text>
          </View>
        )}

        {/* Timestamps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('taskDetail.timeInfo')}</Text>
          <View style={styles.timestampContainer}>
            <View style={styles.timestampRow}>
              <Icon name="add-circle-outline" size={16} color={colors.textDisabled} />
              <Text style={styles.timestampLabel}>{t('taskDetail.createdAt')}:</Text>
              <Text style={styles.timestampValue}>
                {moment(task.created_at).format('DD/MM/YYYY HH:mm')}
              </Text>
            </View>
            {task.updated_at && task.updated_at !== task.created_at && (
              <View style={styles.timestampRow}>
                <Icon name="create-outline" size={16} color={colors.textDisabled} />
                <Text style={styles.timestampLabel}>{t('taskDetail.updatedAt')}:</Text>
                <Text style={styles.timestampValue}>
                  {moment(task.updated_at).format('DD/MM/YYYY HH:mm')}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Subtasks Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('taskDetail.subtasks')}</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => navigation.navigate('AddEditTask', { mode: 'create', parentTask: task })}
            >
              <Icon name="add" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <SubtaskList 
            subtasks={subtasks} 
            onSubtasksChanged={(updatedSubtasks) => {
              setSubtasks(updatedSubtasks);
              // Refresh the parent task to get updated completion percentage
              if (task.id !== undefined) {
                updateTaskCompletion(task.id);
                // Update local task state with new completion percentage
                const updatedTask = { ...task };
                setTask(updatedTask);
              }
            }} 
          />
        </View>

        {/* Action Button */}
        <Button
          title={task.status === 'completed' ? t('taskDetail.markIncomplete') : t('taskDetail.markComplete')}
          onPress={handleToggleStatus}
          variant={task.status === 'completed' ? 'secondary' : 'primary'}
          icon={task.status === 'completed' ? 'refresh' : 'checkmark'}
          style={{ marginTop: spacing.xl }}
        />

        {/* Test Notification Button */}
        <Button
          title={t('taskDetail.testNotification')}
          onPress={handleTestNotification}
          variant="secondary"
          icon="notifications-outline"
          iconColor={colors.primary}
          style={{ marginTop: spacing.md, backgroundColor: colors.primary + '20' }}
          textStyle={{ color: colors.primary }}
        />
      </View>
    </ScrollView>
  );
};

// Create styles with theme colors
const createStyles = (colors: any) => StyleSheet.create({
  metaInfoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  metaText: {
    fontSize: fonts.sizes.sm,
    fontWeight: '500',
  },
  progressContainer: {
    marginBottom: spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  progressText: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  addButton: {
    padding: spacing.xs,
  },
  content: {
    padding: spacing.lg,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  statusText: {
    fontSize: fonts.sizes.sm,
    fontWeight: '600',
  },
  title: {
    fontSize: fonts.sizes.xl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.lg,
    lineHeight: fonts.sizes.xl * 1.3,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fonts.sizes.md,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: fonts.sizes.md,
    color: colors.text,
    lineHeight: fonts.sizes.md * 1.5,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  priorityText: {
    fontSize: fonts.sizes.md,
    fontWeight: '600',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  dateText: {
    fontSize: fonts.sizes.md,
    color: colors.text,
    fontWeight: '500',
  },
  relativeDateText: {
    fontSize: fonts.sizes.sm,
    color: colors.textDisabled,
    fontStyle: 'italic',
  },
  timestampContainer: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  timestampLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    minWidth: 70,
  },
  timestampValue: {
    fontSize: fonts.sizes.sm,
    color: colors.text,
    fontWeight: '500',
  },
  // Category styles
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.xs,
  },
  categoryText: {
    fontSize: fonts.sizes.md,
    fontWeight: '500',
  },
  categoryIcon: {
    marginLeft: spacing.xs,
  },
  // Tags styles
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tagContainer: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    marginBottom: spacing.xs,
  },
  tagText: {
    fontSize: fonts.sizes.sm,
    fontWeight: '500',
  },
});

export default TaskDetailScreen;
