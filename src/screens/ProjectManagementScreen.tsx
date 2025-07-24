import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useProjectContext } from '@context/ProjectContext';
import { useTheme } from '@context/ThemeContext';
import Button from '@components/Button';
import LoadingSpinner from '@components/LoadingSpinner';
import ColorPicker from '@components/ColorPicker';
import { Project } from '../types/Task';
import { useTranslation } from '../i18n/i18n';

const ProjectManagementScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp<any>>();
  const { projects, loading, error, loadProjects, addProject, updateProject, deleteProject } = useProjectContext();

  const [isAddMode, setIsAddMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectColor, setProjectColor] = useState('#3498db');
  const [projectStatus, setProjectStatus] = useState<Project['status']>('not_started');
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  useEffect(() => {
    loadProjects();
  }, []);

  const resetForm = useCallback(() => {
    setProjectName('');
    setProjectDescription('');
    setProjectColor('#3498db');
    setProjectStatus('not_started');
    setStartDate(undefined);
    setEndDate(undefined);
    setIsAddMode(false);
    setIsEditMode(false);
    setSelectedProject(null);
  }, []);

  const handleAddProject = useCallback(async () => {
    if (!projectName.trim()) {
      Alert.alert(t('error'), t('project_name_required'));
      return;
    }

    const newProject: Omit<Project, 'id' | 'created_at'> = {
      name: projectName.trim(),
      description: projectDescription.trim() || undefined,
      start_date: startDate,
      end_date: endDate,
      status: projectStatus,
      color: projectColor,
    };

    await addProject(newProject);
    resetForm();
  }, [projectName, projectDescription, startDate, endDate, projectStatus, projectColor, addProject, resetForm, t]);

  const handleEditProject = useCallback(async () => {
    if (!selectedProject || !projectName.trim()) {
      Alert.alert(t('error'), t('project_name_required'));
      return;
    }

    const updatedProject: Partial<Project> = {
      name: projectName.trim(),
      description: projectDescription.trim() || undefined,
      start_date: startDate,
      end_date: endDate,
      status: projectStatus,
      color: projectColor,
    };

    await updateProject(selectedProject.id!, updatedProject);
    resetForm();
  }, [selectedProject, projectName, projectDescription, startDate, endDate, projectStatus, projectColor, updateProject, resetForm, t]);

  const handleDeleteProject = useCallback((project: Project) => {
    Alert.alert(
      t('delete_project'),
      t('delete_project_confirmation', { name: project.name }),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            if (project.id) {
              await deleteProject(project.id);
            }
          },
        },
      ],
    );
  }, [t, deleteProject]);

  const handleSelectProject = useCallback((project: Project) => {
    setSelectedProject(project);
    setProjectName(project.name);
    setProjectDescription(project.description || '');
    setProjectColor(project.color);
    setProjectStatus(project.status);
    setStartDate(project.start_date);
    setEndDate(project.end_date);
    setIsEditMode(true);
  }, []);

  const renderProjectItem = useCallback(({ item }: { item: Project }) => {
    return (
      <TouchableOpacity
        style={[styles.projectItem, { backgroundColor: colors.card }]}
        onPress={() => handleSelectProject(item)}
      >
        <View style={[styles.projectColor, { backgroundColor: item.color }]} />
        <View style={styles.projectInfo}>
          <Text style={[styles.projectName, { color: colors.text }]}>{item.name}</Text>
          {item.description ? (
            <Text style={[styles.projectDescription, { color: colors.text }]} numberOfLines={1}>
              {item.description}
            </Text>
          ) : null}
          <Text style={[styles.projectStatus, { color: colors.text }]}>
            {t(`project_status_${item.status}`)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteProject(item)}
        >
          <Text style={styles.deleteButtonText}>✕</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }, [colors, t, handleSelectProject, handleDeleteProject]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {error ? (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      ) : null}

      {isAddMode || isEditMode ? (
        <View style={styles.formContainer}>
          <Text style={[styles.formTitle, { color: colors.text }]}>
            {isAddMode ? t('add_project') : t('edit_project')}
          </Text>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>{t('project_name')} *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
              placeholder={t('enter_project_name')}
              placeholderTextColor={colors.text + '80'}
              value={projectName}
              onChangeText={setProjectName}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>{t('project_description')}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, height: 80 }]}
              placeholder={t('enter_project_description')}
              placeholderTextColor={colors.text + '80'}
              value={projectDescription}
              onChangeText={setProjectDescription}
              multiline
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>{t('project_status')}</Text>
            <View style={styles.statusContainer}>
              {['not_started', 'in_progress', 'completed', 'on_hold'].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusOption,
                    { borderColor: colors.border },
                    projectStatus === status && { backgroundColor: projectColor + '40', borderColor: projectColor }
                  ]}
                  onPress={() => setProjectStatus(status as Project['status'])}
                >
                  <Text 
                    style={[
                      styles.statusText, 
                      { color: colors.text },
                      projectStatus === status && { color: projectColor }
                    ]}
                  >
                    {status === 'not_started' && t('project_status_not_started')}
                    {status === 'in_progress' && t('project_status_in_progress')}
                    {status === 'completed' && t('project_status_completed')}
                    {status === 'on_hold' && t('project_status_on_hold')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.colorPickerContainer}>
            <Text style={[styles.label, { color: colors.text }]}>{t('color')}</Text>
            <ColorPicker selectedColor={projectColor} onSelectColor={setProjectColor} />
          </View>
          
          <View style={styles.buttonContainer}>
            <Button
              title={t('cancel')}
              onPress={resetForm}
              variant="secondary"
              style={styles.button}
            />
            <Button
              title={isAddMode ? t('add') : t('update')}
              onPress={isAddMode ? handleAddProject : handleEditProject}
              variant="primary"
              style={styles.button}
            />
          </View>
        </View>
      ) : (
        <>
          <Button
            title={t('add_project')}
            onPress={() => setIsAddMode(true)}
            variant="primary"
            style={styles.addButton}
          />
          {projects.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.text }]}>{t('no_projects')}</Text>
          ) : (
            <FlatList
              data={projects}
              renderItem={renderProjectItem}
              keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
              style={styles.list}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  addButton: {
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  projectItem: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  projectColor: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  projectDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  projectStatus: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    color: 'red',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 32,
  },
  formContainer: {
    padding: 16,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  statusOption: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
  },
  colorPickerContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default ProjectManagementScreen;