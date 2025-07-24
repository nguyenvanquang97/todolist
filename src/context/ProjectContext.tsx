import React, { createContext, useContext, useState, useEffect, ReactNode, useReducer, useCallback } from 'react';
import { Project, Task } from '../types/Task';
import DatabaseHelper from '@database/DatabaseHelper';

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

type ProjectAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: { id: number; project: Partial<Project> } }
  | { type: 'DELETE_PROJECT'; payload: number }
  | { type: 'CLEAR_ERROR' };

const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
};

const projectReducer = (state: ProjectState, action: ProjectAction): ProjectState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload, loading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'ADD_PROJECT':
      return { ...state, projects: [action.payload, ...state.projects] };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id
            ? { ...project, ...action.payload.project }
            : project
        ),
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload),
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  error: string | null;
  loadProjects: () => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'created_at'>) => Promise<number | null>;
  updateProject: (id: number, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  getTasksByProject: (projectId: number) => Promise<Task[]>;
  updateTaskProject: (taskId: number, projectId: number | null) => Promise<void>;
  clearError: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, initialState);
  const dbHelper = DatabaseHelper.getInstance();

  const loadProjects = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const projects = await dbHelper.getAllProjects();
      dispatch({ type: 'SET_PROJECTS', payload: projects });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load projects' });
      console.error('Load projects error:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch, dbHelper]);

  useEffect(() => {
    loadProjects();
  }, []);

  const addProject = useCallback(async (project: Omit<Project, 'id' | 'created_at'>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const result = await dbHelper.insertProject(project);

      if (result.insertId) {
        const newProject: Project = {
          ...project,
          id: result.insertId,
          created_at: new Date().toISOString(),
        };
        dispatch({ type: 'ADD_PROJECT', payload: newProject });
        dispatch({ type: 'SET_LOADING', payload: false });
        return result.insertId; // Return the ID of the newly created project
      }
      dispatch({ type: 'SET_LOADING', payload: false });
      return null;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add project' });
      console.error('Add project error:', error);
      return null;
    }
  }, [dispatch, dbHelper]);

  const updateProject = useCallback(async (id: number, project: Partial<Project>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await dbHelper.updateProject(id, project);
      dispatch({ type: 'UPDATE_PROJECT', payload: { id, project } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update project' });
      console.error('Update project error:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch, dbHelper]);

  const deleteProject = useCallback(async (id: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await dbHelper.deleteProject(id);
      dispatch({ type: 'DELETE_PROJECT', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete project' });
      console.error('Delete project error:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch, dbHelper]);

  const getTasksByProject = useCallback(async (projectId: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const tasks = await dbHelper.getTasksByProject(projectId);
      return tasks;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to get tasks by project' });
      console.error('Get tasks by project error:', error);
      return [];
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch, dbHelper]);

  const updateTaskProject = useCallback(async (taskId: number, projectId: number | null) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await dbHelper.updateTaskProject(taskId, projectId);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update task project' });
      console.error('Update task project error:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch, dbHelper]);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, [dispatch]);

  const value: ProjectContextType = {
    projects: state.projects,
    loading: state.loading,
    error: state.error,
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