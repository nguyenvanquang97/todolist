import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Toast } from '@components/Toast';
import { ConfirmDialog } from '@components/ConfirmDialog';
import { useTaskContext } from '@context/TaskContext';
import { useTheme } from '@context/ThemeContext';
import { Task, Project } from '../../types/Task';
import MemoizedTaskItem from '@components/MemoizedTaskItem';
import { useTranslation } from 'react-i18next';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@navigation/RootStackNavigator';

interface ProjectTaskListProps {
  project: Project;
}

const ProjectTaskList: React.FC<ProjectTaskListProps> = ({ project }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { tasks, updateTaskProject } = useTaskContext();

  const [projectTasks, setProjectTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Filter tasks that belong to this project
    const filteredTasks = tasks.filter(task => task.project_id === project.id);
    setProjectTasks(filteredTasks);
  }, [tasks, project.id]);

  const handleTaskPress = (task: Task) => {
    navigation.navigate('TaskDetail' as any, { taskId: task.id });
  };

  const handleRemoveTaskFromProject = async (taskId: number) => {
    ConfirmDialog.show({
      title: t('taskList.removeConfirmTitle'),
      message: t('taskList.removeConfirmMessage'),
      confirmText: t('common.remove'),
      cancelText: t('common.cancel'),
      onConfirm: async () => {
        try {
          await updateTaskProject(taskId, null);
          // Task list will update automatically via the tasks context
          Toast.show(t('task_removed_from_project'), 'success');
        } catch (error) {
          console.error('Error removing task from project:', error);
          Toast.show(t('failed_to_remove_task_from_project'), 'error');
        }
      }
    });
  };

  const renderItem = ({ item }: { item: Task }) => (
    <View style={styles.taskItemContainer}>
      <MemoizedTaskItem 
        task={item} 
        onPress={() => handleTaskPress(item)}
        onToggleStatus={() => {}}
        onDelete={() => {}}
      />
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => handleRemoveTaskFromProject(item.id!)}
      >
        <Text style={[styles.removeButtonText, { color: colors.error }]}>
          {t('remove')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: colors.text }]}>
        {t('no_tasks_in_project')}
      </Text>
      <TouchableOpacity 
        style={[styles.addTaskButton, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('AddEditTask' as any, { projectId: project.id })}
      >
        <Text style={[styles.addTaskButtonText, { color: colors.white }]}>
          {t('add_task')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t('tasks')}</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('AddEditTask' as any, { projectId: project.id })}
        >
          <Text style={[styles.addButton, { color: colors.primary }]}>{t('add')}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={projectTasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id!.toString()}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={projectTasks.length === 0 ? styles.emptyListContent : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  taskItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  removeButton: {
    marginLeft: 8,
    padding: 8,
  },
  removeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTaskButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addTaskButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ProjectTaskList;