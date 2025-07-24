import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { useProjectContext } from '@context/ProjectContext';
import { useTaskContext } from '@context/TaskContext';
import { useTheme } from '@context/ThemeContext';
import Button from '@components/Button';
import LoadingSpinner from '@components/LoadingSpinner';
import MemoizedTaskItem from '@components/MemoizedTaskItem';
import { Project, Task } from '../types/Task';
import { useTranslation } from 'react-i18next';

type ProjectDetailScreenRouteProp = RouteProp<
  { ProjectDetail: { projectId: number } },
  'ProjectDetail'
>;

const ProjectDetailScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<ProjectDetailScreenRouteProp>();
  const { projectId } = route.params;

  const { projects, loading: projectLoading, getTasksByProject } = useProjectContext();
  const { tasks, loading: taskLoading, updateTaskProject } = useTaskContext();

  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const currentProject = projects.find(p => p.id === projectId);
    if (currentProject) {
      setProject(currentProject);
    }
  }, [projectId, projects]);

  useEffect(() => {
    const loadProjectTasks = async () => {
      if (projectId) {
        const tasks = await getTasksByProject(projectId);
        setProjectTasks(tasks);
      }
    };

    loadProjectTasks();
  }, [projectId, getTasksByProject]);

  const handleEditProject = () => {
    if (project) {
      // Sử dụng as any để tránh lỗi TypeScript
      (navigation as any).navigate('ProjectManagement');
      // In a real implementation, you would navigate to edit mode with the project ID
      // navigation.navigate('EditProject', { projectId: project.id });
    }
  };

  const handleRemoveTaskFromProject = (taskId: number) => {
    Alert.alert(
      t('remove_from_project'),
      t('remove_task_from_project_confirmation'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('remove'),
          style: 'destructive',
          onPress: async () => {
            await updateTaskProject(taskId, null);
            // Refresh project tasks
            const updatedTasks = await getTasksByProject(projectId);
            setProjectTasks(updatedTasks);
          },
        },
      ],
    );
  };

  const handleAddTaskToProject = () => {
    // Navigate to task list or create new task with pre-selected project
    (navigation as any).navigate('AddEditTask', { projectId });
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <View style={styles.taskItemContainer}>
      <MemoizedTaskItem 
        task={item} 
        onPress={() => navigation.navigate('TaskDetail', { task: item })}
        onToggleStatus={() => {}}
        onDelete={() => {}}
      />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveTaskFromProject(item.id!)}
      >
        <Text style={styles.removeButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  if (projectLoading || taskLoading) {
    return <LoadingSpinner />;
  }

  if (!project) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>{t('project_not_found')}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.projectHeader, { backgroundColor: project.color + '20' }]}>
        <View style={styles.projectHeaderContent}>
          <View style={[styles.projectColorIndicator, { backgroundColor: project.color }]} />
          <View style={styles.projectInfo}>
            <Text style={[styles.projectName, { color: colors.text }]}>{project.name}</Text>
            {project.description ? (
              <Text style={[styles.projectDescription, { color: colors.text }]}>
                {project.description}
              </Text>
            ) : null}
            <Text style={[styles.projectStatus, { color: colors.text }]}>
              {t(`project_status_${project.status}`)}
            </Text>
            {project.start_date ? (
              <Text style={[styles.projectDate, { color: colors.text }]}>
                {t('start_date')}: {new Date(project.start_date).toLocaleDateString()}
              </Text>
            ) : null}
            {project.end_date ? (
              <Text style={[styles.projectDate, { color: colors.text }]}>
                {t('end_date')}: {new Date(project.end_date).toLocaleDateString()}
              </Text>
            ) : null}
          </View>
        </View>
        <Button
          title={t('edit_project')}
          onPress={handleEditProject}
          variant="secondary"
          style={styles.editButton}
        />
      </View>

      <View style={styles.tasksContainer}>
        <View style={styles.tasksHeader}>
          <Text style={[styles.tasksTitle, { color: colors.text }]}>{t('tasks')}</Text>
          <Button
            title={t('add_task')}
            onPress={handleAddTaskToProject}
            variant="primary"
            style={styles.addTaskButton}
          />
        </View>

        {projectTasks.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.text }]}>{t('no_tasks_in_project')}</Text>
        ) : (
          <FlatList
            data={projectTasks}
            renderItem={renderTaskItem}
            keyExtractor={(item) => item.id?.toString() || ''}
            style={styles.tasksList}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
  },
  projectHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  projectHeaderContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  projectColorIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
    marginTop: 4,
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  projectDescription: {
    fontSize: 16,
    marginBottom: 8,
  },
  projectStatus: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  projectDate: {
    fontSize: 14,
    marginBottom: 4,
  },
  editButton: {
    alignSelf: 'flex-end',
  },
  tasksContainer: {
    flex: 1,
    padding: 16,
  },
  tasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tasksTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addTaskButton: {
    minWidth: 100,
  },
  tasksList: {
    flex: 1,
  },
  taskItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
  },
  removeButtonText: {
    color: 'red',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 32,
  },
});

export default ProjectDetailScreen;