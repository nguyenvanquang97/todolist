import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Task, TaskFilter, TaskContextType } from '../types/Task';
import DatabaseHelper from '../database/DatabaseHelper';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

type TaskAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: number; task: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: number }
  | { type: 'CLEAR_ERROR' };

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload, loading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.task }
            : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const dbHelper = DatabaseHelper.getInstance();

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await dbHelper.initDatabase();
      await loadTasks();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize database' });
      console.error('Database initialization error:', error);
    }
  };

  const loadTasks = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const tasks = await dbHelper.getAllTasks();
      dispatch({ type: 'SET_TASKS', payload: tasks });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load tasks' });
      console.error('Load tasks error:', error);
    }
  };

  const addTask = async (task: Omit<Task, 'id' | 'created_at'>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const result = await dbHelper.insertTask(task);
      
      if (result.insertId) {
        const newTask: Task = {
          ...task,
          id: result.insertId,
          created_at: new Date().toISOString(),
        };
        dispatch({ type: 'ADD_TASK', payload: newTask });
      }
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add task' });
      console.error('Add task error:', error);
    }
  };

  const updateTask = async (id: number, task: Partial<Task>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await dbHelper.updateTask(id, task);
      dispatch({ type: 'UPDATE_TASK', payload: { id, task } });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update task' });
      console.error('Update task error:', error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await dbHelper.deleteTask(id);
      dispatch({ type: 'DELETE_TASK', payload: id });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete task' });
      console.error('Delete task error:', error);
    }
  };

  const searchTasks = async (query: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const tasks = await dbHelper.searchTasks(query);
      dispatch({ type: 'SET_TASKS', payload: tasks });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to search tasks' });
      console.error('Search tasks error:', error);
    }
  };

  const filterTasks = async (filter: TaskFilter) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const tasks = await dbHelper.filterTasks(filter);
      dispatch({ type: 'SET_TASKS', payload: tasks });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to filter tasks' });
      console.error('Filter tasks error:', error);
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: TaskContextType = {
    tasks: state.tasks,
    loading: state.loading,
    error: state.error,
    loadTasks,
    addTask,
    updateTask,
    deleteTask,
    searchTasks,
    filterTasks,
    clearError,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTaskContext = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

export default TaskContext;