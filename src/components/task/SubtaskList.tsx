import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useTaskContext } from '@context/TaskContext';
import { useTheme } from '@context/ThemeContext';
import type { Task } from '@/types/Task';
import Button from '@components/Button';
import ProgressBar from '@components/task/ProgressBar';
import { useTranslation } from '@/i18n';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@navigation/RootStackNavigator';


interface SubtaskListProps {
  parentTaskId?: number;
  subtasks?: Task[];
  onSubtasksChanged?: (updatedSubtasks: Task[]) => void;
}

const SubtaskList: React.FC<SubtaskListProps> = ({ parentTaskId, subtasks: initialSubtasks, onSubtasksChanged }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { getSubtasks, addTask, updateTask, deleteTask, updateTaskCompletion } = useTaskContext();

  const [subtasks, setSubtasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);

  const loadSubtasks = async () => {
    if (!parentTaskId) return;
    
    setLoading(true);
    try {
      const tasks = await getSubtasks(parentTaskId);
      setSubtasks(tasks);
      calculateOverallProgress(tasks);
      
      // Notify parent component if callback is provided
      if (onSubtasksChanged) {
        onSubtasksChanged(tasks);
      }
    } catch (error) {
      console.error('Error loading subtasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialSubtasks) {
      setSubtasks(initialSubtasks);
      calculateOverallProgress(initialSubtasks);
    } else {
      loadSubtasks();
    }
  }, [parentTaskId, initialSubtasks]);

  const calculateOverallProgress = (tasks: Task[]) => {
    if (tasks.length === 0) {
      setOverallProgress(0);
      return;
    }

    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const progress = (completedTasks / tasks.length) * 100;
    setOverallProgress(progress);

    // Update parent task completion percentage
    if (parentTaskId) {
      updateTaskCompletion(parentTaskId, progress);
    }
    
    // Notify parent component if callback is provided
    if (onSubtasksChanged) {
      onSubtasksChanged(tasks);
    }
  };

  const handleAddSubtask = async () => {
    if (!newSubtaskTitle.trim() || !parentTaskId) {
      Alert.alert(t('common.error'), t('addEditTask.errors.emptyTitle'));
      return;
    }

    const newSubtask: Omit<Task, 'id' | 'created_at'> = {
      title: newSubtaskTitle.trim(),
      priority: 'medium',
      status: 'pending',
      parent_task_id: parentTaskId,
      completion_percentage: 0,
    };

    try {
      await addTask(newSubtask);
      setNewSubtaskTitle('');
      setIsAddingSubtask(false);
      loadSubtasks();
    } catch (error) {
      console.error('Error adding subtask:', error);
      Alert.alert(t('common.error'), t('addEditTask.addError'));
    }
  };

  const handleToggleSubtaskStatus = async (subtask: Task) => {
    try {
      const newStatus = subtask.status === 'completed' ? 'pending' : 'completed';
      const completionPercentage = newStatus === 'completed' ? 100 : 0;
      
      await updateTask(subtask.id!, {
        status: newStatus,
        completion_percentage: completionPercentage,
      });
      
      loadSubtasks();
    } catch (error) {
      console.error('Error updating subtask status:', error);
      Alert.alert(t('common.error'), t('addEditTask.updateError'));
    }
  };

  const handleDeleteSubtask = (subtaskId: number) => {
    Alert.alert(
      t('taskDetail.deleteConfirmTitle'),
      t('taskDetail.deleteConfirmMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(subtaskId);
              loadSubtasks();
            } catch (error) {
              console.error('Error deleting subtask:', error);
              Alert.alert(t('common.error'), t('taskList.deleteError'));
            }
          },
        },
      ],
    );
  };

  const renderSubtask = (subtask: Task) => {
    return (
      <View key={subtask.id} style={[styles.subtaskItem, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={styles.subtaskCheckbox}
          onPress={() => handleToggleSubtaskStatus(subtask)}
        >
          <View
            style={[
              styles.checkbox,
              {
                backgroundColor: subtask.status === 'completed' ? colors.primary : 'transparent',
                borderColor: colors.primary,
              },
            ]}
          >
            {subtask.status === 'completed' && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>
        
        <Text
          style={[
            styles.subtaskTitle,
            {
              color: colors.text,
              textDecorationLine: subtask.status === 'completed' ? 'line-through' : 'none',
            },
          ]}
        >
          {subtask.title}
        </Text>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteSubtask(subtask.id!)}
        >
          <Text style={styles.deleteButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t('taskDetail.subtasks')}</Text>
        <TouchableOpacity onPress={() => setIsAddingSubtask(!isAddingSubtask)}>
          <Text style={[styles.addButton, { color: colors.primary }]}>
            {isAddingSubtask ? t('common.cancel') : t('taskDetail.addSubtask')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <Text style={[styles.progressText, { color: colors.text }]}>
          {t('taskDetail.progress')}: {Math.round(overallProgress)}%
        </Text>
        <ProgressBar progress={overallProgress} />
      </View>

      {isAddingSubtask && (
        <View style={[styles.addSubtaskContainer, { backgroundColor: colors.card }]}>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            placeholder={t('addEditTask.titlePlaceholder')}
            placeholderTextColor={colors.text + '80'}
            value={newSubtaskTitle}
            onChangeText={setNewSubtaskTitle}
          />
          <Button
            title={t('common.add')}
            onPress={handleAddSubtask}
            variant="primary"
            style={styles.addSubtaskButton}
          />
        </View>
      )}

      {loading ? (
        <Text style={[styles.loadingText, { color: colors.text }]}>{t('taskList.loading')}</Text>
      ) : subtasks.length === 0 ? (
        <Text style={[styles.emptyText, { color: colors.text }]}>{t('taskDetail.noSubtasks')}</Text>
      ) : (
        <View style={styles.subtasksList}>
          {subtasks.map(renderSubtask)}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressText: {
    fontSize: 14,
    marginBottom: 4,
  },
  addSubtaskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 8,
    borderRadius: 8,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  addSubtaskButton: {
    minWidth: 80,
  },
  subtasksList: {
    marginTop: 8,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  subtaskCheckbox: {
    marginRight: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  subtaskTitle: {
    flex: 1,
    fontSize: 16,
  },
  deleteButton: {
    padding: 4,
  },
  deleteButtonText: {
    color: 'red',
    fontSize: 16,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
});

export default SubtaskList;