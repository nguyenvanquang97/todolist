import React, { createContext, useContext, useEffect, ReactNode, useCallback } from 'react';
import { Project, Task } from '../types/Task';
import DatabaseHelper from '@database/DatabaseHelper';
import { useTaskContext } from './TaskContext';

// Không cần định nghĩa ProjectState, ProjectAction và projectReducer nữa
// vì chúng ta sẽ sử dụng từ TaskContext

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  error: string | null;
  loadProjects: () => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'created_at'>) => Promise<number | null>;
  updateProject: (id: number, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  getTasksByProject: (projectId: number) => Promise<Task[]>;
  updateTaskProject: (taskId: number, projectId: number | undefined) => Promise<void>;
  clearError: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  // Sử dụng TaskContext để quản lý projects
  const taskContext = useTaskContext();
  const dbHelper = DatabaseHelper.getInstance();
  
  // Sử dụng các phương thức từ TaskContext
  const loadProjects = useCallback(async () => {
    await taskContext.loadProjects();
  }, [taskContext]);

  useEffect(() => {
    // Không cần gọi loadProjects() ở đây vì TaskContext đã xử lý việc này
  }, []);

  const addProject = useCallback(async (project: Omit<Project, 'id' | 'created_at'>) => {
    return await taskContext.addProject(project);
  }, [taskContext]);

  const updateProject = useCallback(async (id: number, project: Partial<Project>) => {
    await taskContext.updateProject(id, project);
  }, [taskContext]);

  const deleteProject = useCallback(async (id: number) => {
    await taskContext.deleteProject(id);
  }, [taskContext]);

  const getTasksByProject = useCallback(async (projectId: number) => {
    try {
      const tasks = await dbHelper.getTasksByProject(projectId);
      return tasks;
    } catch (error) {
      console.error('Get tasks by project error:', error);
      return [];
    }
  }, [dbHelper]);

  const updateTaskProject = useCallback(async (taskId: number, projectId: number | undefined) => {
    await taskContext.updateTaskProject(taskId, projectId);
  }, [taskContext]);

  const clearError = useCallback(() => {
    taskContext.clearError();
  }, [taskContext]);

  const value: ProjectContextType = {
    projects: taskContext.projects,
    loading: taskContext.loading,
    error: taskContext.error,
    loadProjects,
    addProject,
    updateProject,
    deleteProject,
    getTasksByProject,
    updateTaskProject,
    clearError,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

export const useProjectContext = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};

export default ProjectContext;