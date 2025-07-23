export interface Task {
  id?: number;
  title: string;
  description?: string;
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  created_at?: string;
  updated_at?: string;
  category_id?: number;
}

export interface Category {
  id?: number;
  name: string;
  color: string;
  icon?: string;
  created_at?: string;
}

export interface Tag {
  id?: number;
  name: string;
  color: string;
  usage_count?: number;
}

export interface TaskTag {
  task_id: number;
  tag_id: number;
}

export interface TaskFilter {
  status?: 'pending' | 'completed' | 'all';
  priority?: 'low' | 'medium' | 'high' | 'all';
  searchQuery?: string;
  category_id?: string | number | 'all' | 'none';
}

export interface DatabaseResult {
  insertId?: number;
  rowsAffected: number;
}

export interface TaskContextType {
  tasks: Task[];
  categories: Category[];
  tags: Tag[];
  loading: boolean;
  error: string | null;
  loadTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'created_at'>) => Promise<number | null>;
  updateTask: (id: number, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  searchTasks: (query: string) => Promise<void>;
  filterTasks: (filter: TaskFilter) => Promise<void>;
  clearError: () => void;
  // Category methods
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: number, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  updateTaskCategory: (taskId: number, categoryId: number | null) => Promise<void>;
  // Tag methods
  addTag: (tag: Omit<Tag, 'id' | 'usage_count'>) => Promise<void>;
  updateTag: (id: number, tag: Partial<Tag>) => Promise<void>;
  deleteTag: (id: number) => Promise<void>;
  getTagsForTask: (taskId: number) => Promise<Tag[]>;
  addTagToTask: (taskId: number, tagId: number) => Promise<void>;
  removeTagFromTask: (taskId: number, tagId: number) => Promise<void>;
}

export interface AppSettings {
  id?: number;
  theme: 'light' | 'dark' | 'system';
  notifications_enabled: boolean;
  language: 'en' | 'vi';
  last_updated?: string;
}
