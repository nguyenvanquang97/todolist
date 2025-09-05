import React, { createContext, useContext, useState, useEffect, ReactNode, useReducer, useCallback } from 'react';
import { Task, TaskFilter, TaskContextType, Category, Tag, Project } from '../types/Task';
import DatabaseHelper from '@database/DatabaseHelper';
import NotificationService from '@services/NotificationService';
import { scheduleNotificationsForTasks } from '@utils/notificationHelper';

interface TaskState {
  tasks: Task[];
  categories: Category[];
  tags: Tag[];
  projects: Project[];
  loading: boolean;
  error: string | null;
}

type TaskAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: number ; task: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: number }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: { id: number; category: Partial<Category> } }
  | { type: 'DELETE_CATEGORY'; payload: number }
  | { type: 'SET_TAGS'; payload: Tag[] }
  | { type: 'ADD_TAG'; payload: Tag }
  | { type: 'UPDATE_TAG'; payload: { id: number; tag: Partial<Tag> } }
  | { type: 'DELETE_TAG'; payload: number }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: { id: number; project: Partial<Project> } }
  | { type: 'DELETE_PROJECT'; payload: number }
  | { type: 'UPDATE_TASK_COMPLETION'; payload: { id: number; completionPercentage: number } };

const initialState: TaskState = {
  tasks: [],
  categories: [],
  tags: [],
  projects: [],
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
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'ADD_CATEGORY':
      return { ...state, categories: [action.payload, ...state.categories] };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(category =>
          category.id === action.payload.id
            ? { ...category, ...action.payload.category }
            : category
        ),
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload),
        // Update tasks that had this category to have undefined category_id
        tasks: state.tasks.map(task =>
          task.category_id === action.payload
            ? { ...task, category_id: undefined }
            : task
        ),
      };
    case 'SET_TAGS':
      return { ...state, tags: action.payload };
    case 'ADD_TAG':
      return { ...state, tags: [action.payload, ...state.tags] };
    case 'UPDATE_TAG':
      return {
        ...state,
        tags: state.tags.map(tag =>
          tag.id === action.payload.id
            ? { ...tag, ...action.payload.tag }
            : tag
        ),
      };
    case 'DELETE_TAG':
      return {
        ...state,
        tags: state.tags.filter(tag => tag.id !== action.payload),
      };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
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
        // Update tasks that had this project to have undefined project_id
        tasks: state.tasks.map(task =>
          task.project_id === action.payload
            ? { ...task, project_id: undefined }
            : task
        ),
      };
    case 'UPDATE_TASK_COMPLETION':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, completion_percentage: action.payload.completionPercentage }
            : task
        ),
      };
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
  const notificationService = NotificationService.getInstance();

  const initializeNotifications = useCallback(async () => {
    try {
      await notificationService.createNotificationChannel();
    } catch (error) {
      console.error('Notification initialization error:', error);
    }
  }, [notificationService]);

  const initializeDatabase = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await dbHelper.initDatabase();
      try {
        // Tải tất cả các task
        const tasks = await dbHelper.getAllTasks();
        dispatch({ type: 'SET_TASKS', payload: tasks });

        // Tải tất cả các danh mục
        const categories = await dbHelper.getAllCategories();
        dispatch({ type: 'SET_CATEGORIES', payload: categories });

        // Tải tất cả các nhãn
        const tags = await dbHelper.getAllTags();
        dispatch({ type: 'SET_TAGS', payload: tags });

        // Tải tất cả các dự án
        const projects = await dbHelper.getAllProjects();
        dispatch({ type: 'SET_PROJECTS', payload: projects });

        // Lên lịch thông báo cho tất cả các task chưa hoàn thành có ngày đến hạn
        await scheduleNotificationsForTasks(tasks);
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' });
        console.error('Load data error:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize database' });
      console.error('Database initialization error:', error);
    }
  }, [dbHelper, dispatch]);

  useEffect(() => {
    initializeDatabase();
    initializeNotifications();
  }, [initializeDatabase, initializeNotifications]);

  const loadTasks = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Tải tất cả các task
      const tasks = await dbHelper.getAllTasks();
      dispatch({ type: 'SET_TASKS', payload: tasks });

      // Tải tất cả các danh mục
      const categories = await dbHelper.getAllCategories();
      dispatch({ type: 'SET_CATEGORIES', payload: categories });

      // Tải tất cả các nhãn
      const tags = await dbHelper.getAllTags();
      dispatch({ type: 'SET_TAGS', payload: tags });

      // Tải tất cả các dự án
      const projects = await dbHelper.getAllProjects();
      dispatch({ type: 'SET_PROJECTS', payload: projects });

      // Lên lịch thông báo cho tất cả các task chưa hoàn thành có ngày đến hạn
      await scheduleNotificationsForTasks(tasks);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' });
      console.error('Load data error:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
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

        // Lên lịch thông báo nếu có ngày đến hạn
        if (task.due_date) {
          await notificationService.scheduleNotification(newTask);
        }
        
        dispatch({ type: 'SET_LOADING', payload: false });
        return result.insertId; // Trả về ID của task vừa tạo
      }
      dispatch({ type: 'SET_LOADING', payload: false });
      return null;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add task' });
      console.error('Add task error:', error);
      return null;
    }
  };

  const updateTask = async (id: number, task: Partial<Task>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await dbHelper.updateTask(id, task);
      dispatch({ type: 'UPDATE_TASK', payload: { id, task } });

      // Cập nhật thông báo nếu có thay đổi về ngày đến hạn hoặc trạng thái
      if (task.due_date || task.status) {
        // Lấy task hiện tại sau khi cập nhật
        const updatedTask = state.tasks.find(t => t.id === id);
        if (updatedTask) {
          const mergedTask = { ...updatedTask, ...task };

          // Nếu task đã hoàn thành, hủy thông báo
          if (mergedTask.status === 'completed') {
            await notificationService.cancelNotification(id);
          } else if (mergedTask.due_date) {
            // Nếu task chưa hoàn thành và có ngày đến hạn, lên lịch lại thông báo
            await notificationService.scheduleNotification(mergedTask);
          }
        }
      }

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

      // Hủy thông báo khi xóa task
      await notificationService.cancelNotification(id);

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

  const getTask = async (taskId: number): Promise<Task | null> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const task = await dbHelper.getTaskById(taskId);
      return task;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to get task' });
      console.error('Get task error:', error);
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
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

  // Category methods
  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const result = await dbHelper.insertCategory(category);

      if (result.insertId) {
        const newCategory: Category = {
          ...category,
          id: result.insertId,
        };
        dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add category' });
      console.error('Add category error:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateCategory = async (id: number, category: Partial<Category>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await dbHelper.updateCategory(id, category);
      dispatch({ type: 'UPDATE_CATEGORY', payload: { id, category } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update category' });
      console.error('Update category error:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await dbHelper.deleteCategory(id);
      dispatch({ type: 'DELETE_CATEGORY', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete category' });
      console.error('Delete category error:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateTaskCategory = async (taskId: number, categoryId: number | null) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await dbHelper.updateTaskCategory(taskId, categoryId);
      dispatch({
        type: 'UPDATE_TASK',
        payload: { id: taskId, task: { category_id: categoryId } },
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update task category' });
      console.error('Update task category error:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Tag methods
  const addTag = async (tag: Omit<Tag, 'id' | 'usage_count'>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const result = await dbHelper.insertTag(tag);

      if (result.insertId) {
        const newTag: Tag = {
          ...tag,
          id: result.insertId,
          usage_count: 0,
        };
        dispatch({ type: 'ADD_TAG', payload: newTag });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add tag' });
      console.error('Add tag error:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateTag = async (id: number, tag: Partial<Tag>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await dbHelper.updateTag(id, tag);
      dispatch({ type: 'UPDATE_TAG', payload: { id, tag } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update tag' });
      console.error('Update tag error:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteTag = async (id: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await dbHelper.deleteTag(id);
      dispatch({ type: 'DELETE_TAG', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete tag' });
      console.error('Delete tag error:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getTagsForTask = useCallback(async (taskId: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const tags = await dbHelper.getTagsForTask(taskId);
      return tags;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to get tags for task' });
      console.error('Get tags for task error:', error);
      return [];
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dbHelper]);

  const addTagToTask = async (taskId: number, tagId: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await dbHelper.addTagToTask(taskId, tagId);
      // Update tag usage count in state
      const updatedTags = state.tags.map(tag => {
        if (tag.id === tagId) {
          return { ...tag, usage_count: (tag.usage_count || 0) + 1 };
        }
        return tag;
      });
      dispatch({ type: 'SET_TAGS', payload: updatedTags });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add tag to task' });
      console.error('Add tag to task error:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const removeTagFromTask = async (taskId: number, tagId: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await dbHelper.removeTagFromTask(taskId, tagId);
      // Update tag usage count in state
      const updatedTags = state.tags.map(tag => {
        if (tag.id === tagId && (tag.usage_count || 0) > 0) {
          return { ...tag, usage_count: (tag.usage_count || 0) - 1 };
        }
        return tag;
      });
      dispatch({ type: 'SET_TAGS', payload: updatedTags });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove tag from task' });
      console.error('Remove tag from task error:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Subtask methods
  const getSubtasks = useCallback(async (parentTaskId: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const subtasks = await dbHelper.getSubtasks(parentTaskId);
      return subtasks;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to get subtasks' });
      console.error('Get subtasks error:', error);
      return [];
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dbHelper, dispatch]);

  const updateTaskCompletion = useCallback(async (taskId: number, completionPercentage: number) => {
    try {
      // Không set loading để tránh re-render liên tục
      await dbHelper.updateTaskCompletion(taskId, completionPercentage);
      dispatch({ 
        type: 'UPDATE_TASK_COMPLETION', 
        payload: { id: taskId, completionPercentage } 
      });

      // If this is a subtask, update the parent task's completion percentage
      const task = state.tasks.find(t => t.id === taskId);
      if (task && task.parent_task_id) {
        const parentCompletion = await dbHelper.calculateParentCompletion(task.parent_task_id);
        // Cập nhật giá trị vào database
        await dbHelper.updateTaskCompletion(task.parent_task_id, parentCompletion);
        // Chỉ cập nhật task cha cụ thể thay vì tải lại toàn bộ danh sách task
        dispatch({ 
          type: 'UPDATE_TASK_COMPLETION', 
          payload: { id: task.parent_task_id, completionPercentage: parentCompletion } 
        });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update task completion' });
      console.error('Update task completion error:', error);
    }
  }, [dbHelper, dispatch, state.tasks]);

  const value: TaskContextType = {
    tasks: state.tasks,
    categories: state.categories,
    tags: state.tags,
    projects: state.projects,
    loading: state.loading,
    error: state.error,
    loadTasks,
    getTask,
    addTask,
    updateTask,
    deleteTask,
    searchTasks,
    filterTasks,
    clearError,
    // Category methods
    addCategory,
    updateCategory,
    // Project methods
    loadProjects: async () => {
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
    },
    addProject: async (project: Omit<Project, 'id' | 'created_at'>) => {
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
    },
    updateProject: async (id: number, project: Partial<Project>) => {
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
    },
    deleteProject: async (id: number) => {
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
    },
    updateTaskProject: async (taskId: number, projectId: number | null | undefined) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        await dbHelper.updateTaskProject(taskId, projectId);
        dispatch({ 
          type: 'UPDATE_TASK', 
          payload: { 
            id: taskId, 
            task: { project_id: projectId } 
          } 
        });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to update task project' });
        console.error('Update task project error:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    deleteCategory,
    updateTaskCategory,
    // Tag methods
    addTag,
    updateTag,
    deleteTag,
    getTagsForTask,
    addTagToTask,
    removeTagFromTask,
    // Subtask methods
    getSubtasks,
    updateTaskCompletion,
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
