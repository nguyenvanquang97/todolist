export interface Task {
  id?: number;
  title: string;
  description?: string;
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  created_at?: string;
  updated_at?: string;
}

export interface TaskFilter {
  status?: 'pending' | 'completed' | 'all';
  priority?: 'low' | 'medium' | 'high' | 'all';
  searchQuery?: string;
}

export interface DatabaseResult {
  insertId?: number;
  rowsAffected: number;
}

export interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  loadTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'created_at'>) => Promise<void>;
  updateTask: (id: number, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  searchTasks: (query: string) => Promise<void>;
  filterTasks: (filter: TaskFilter) => Promise<void>;
  clearError: () => void;
}

export interface AppSettings {
  id?: number;
  theme: 'light' | 'dark' | 'system';
  notifications_enabled: boolean;
  language: 'en' | 'vi';
  last_updated?: string;
}
