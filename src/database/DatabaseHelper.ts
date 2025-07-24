import SQLite from 'react-native-sqlite-storage';
import { Task, TaskFilter, DatabaseResult, AppSettings, Category, Tag, TaskTag, Project } from '../types/Task';
import SQLiteModule from 'react-native-sqlite-storage';

// Enable promise for SQLite
SQLiteModule.enablePromise(true);

class DatabaseHelper {
  private static instance: DatabaseHelper;
  private database: any = null;

  private constructor() {}

  public static getInstance(): DatabaseHelper {
    if (!DatabaseHelper.instance) {
      DatabaseHelper.instance = new DatabaseHelper();
    }
    return DatabaseHelper.instance;
  }

  public async initDatabase(): Promise<any> {
    try {
      if (!this.database) {
        this.database = await SQLiteModule.openDatabase({
          name: 'TodoApp.db',
          location: 'default',
        });
        await this.createTasksTable();
        console.log('Database initialized successfully');
      }
      return this.database;
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  private async createTasksTable(): Promise<void> {
    const createTasksTableQuery = `
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        due_date TEXT,
        priority TEXT,
        status TEXT,
        created_at TEXT,
        category_id INTEGER,
        project_id INTEGER,
        parent_task_id INTEGER,
        completion_percentage INTEGER DEFAULT 0
      );
    `;

    const createSettingsTableQuery = `
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        theme TEXT NOT NULL,
        notifications_enabled INTEGER NOT NULL,
        language TEXT NOT NULL,
        last_updated TEXT
      );
    `;

    const createCategoriesTableQuery = `
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        color TEXT NOT NULL,
        icon TEXT,
        created_at TEXT NOT NULL
      );
    `;

    const createTagsTableQuery = `
      CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        color TEXT NOT NULL,
        usage_count INTEGER DEFAULT 0
      );
    `;

    const createTaskTagsTableQuery = `
      CREATE TABLE IF NOT EXISTS task_tags (
        task_id INTEGER,
        tag_id INTEGER,
        PRIMARY KEY (task_id, tag_id),
        FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
      );
    `;

    const createProjectsTableQuery = `
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        start_date TEXT,
        end_date TEXT,
        status TEXT NOT NULL,
        color TEXT,
        created_at TEXT NOT NULL
      );
    `;

    try {
      await this.database?.executeSql(createTasksTableQuery);
      await this.database?.executeSql(createSettingsTableQuery);
      await this.database?.executeSql(createCategoriesTableQuery);
      await this.database?.executeSql(createTagsTableQuery);
      await this.database?.executeSql(createTaskTagsTableQuery);
      await this.database?.executeSql(createProjectsTableQuery);
      console.log('Database tables created successfully');

      // Initialize settings if not exists
      await this.initializeSettings();
    } catch (error) {
      console.error('Error creating database tables:', error);
      throw error;
    }
  }

  private async initializeSettings(): Promise<void> {
    try {
      // Check if settings already exist
      const checkQuery = 'SELECT COUNT(*) as count FROM settings;';
      const result = await this.database?.executeSql(checkQuery);
      const count = result?.[0].rows.item(0).count;

      if (count === 0) {
        // Insert default settings
        const insertQuery = `
          INSERT INTO settings (theme, notifications_enabled, language, last_updated)
          VALUES (?, ?, ?, ?);
        `;
        const now = new Date().toISOString();
        await this.database?.executeSql(insertQuery, ['system', 1, 'vi', now]);
        console.log('Default settings initialized');
      } else {
        // Check if language column exists
        try {
          const checkLanguageQuery = 'SELECT language FROM settings LIMIT 1;';
          await this.database?.executeSql(checkLanguageQuery);
        } catch (e) {
          // Language column doesn't exist, add it
          const alterTableQuery = 'ALTER TABLE settings ADD COLUMN language TEXT NOT NULL DEFAULT "vi";';
          await this.database?.executeSql(alterTableQuery);
          console.log('Added language column to settings table');
        }
      }
    } catch (error) {
      console.error('Error initializing settings:', error);
      throw error;
    }
  }

  public async insertTask(task: Omit<Task, 'id' | 'created_at'>): Promise<DatabaseResult> {
    const insertQuery = `
      INSERT INTO tasks (title, description, due_date, priority, status, created_at, category_id)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    const createdAt = new Date().toISOString();
    const values = [
      task.title,
      task.description || null,
      task.due_date || null,
      task.priority,
      task.status,
      createdAt,
      task.category_id || null,
    ];

    try {
      const result = await this.database?.executeSql(insertQuery, values);
      return {
        insertId: result?.[0].insertId,
        rowsAffected: result?.[0].rowsAffected || 0,
      };
    } catch (error) {
      console.error('Error inserting task:', error);
      throw error;
    }
  }

  public async getAllTasks(): Promise<Task[]> {
    const selectQuery = 'SELECT * FROM tasks ORDER BY created_at DESC;';

    try {
      const result = await this.database?.executeSql(selectQuery);
      const tasks: Task[] = [];

      if (result && result[0].rows.length > 0) {
        for (let i = 0; i < result[0].rows.length; i++) {
          tasks.push(result[0].rows.item(i));
        }
      }

      return tasks;
    } catch (error) {
      console.error('Error getting all tasks:', error);
      throw error;
    }
  }

  public async updateTask(id: number, task: Partial<Task>): Promise<DatabaseResult> {
    const updateFields: string[] = [];
    const values: any[] = [];

    Object.entries(task).forEach(([key, value]) => {
      if (key !== 'id' && value !== undefined) {
        updateFields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (updateFields.length === 0) {
      throw new Error('No fields to update');
    }

    const updateQuery = `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = ?;`;
    values.push(id);

    try {
      const result = await this.database?.executeSql(updateQuery, values);
      return {
        rowsAffected: result?.[0].rowsAffected || 0,
      };
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  public async deleteTask(id: number): Promise<DatabaseResult> {
    const deleteQuery = 'DELETE FROM tasks WHERE id = ?;';

    try {
      const result = await this.database?.executeSql(deleteQuery, [id]);
      return {
        rowsAffected: result?.[0].rowsAffected || 0,
      };
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  public async searchTasks(query: string): Promise<Task[]> {
    const searchQuery = `
      SELECT * FROM tasks 
      WHERE title LIKE ? OR description LIKE ?
      ORDER BY created_at DESC;
    `;
    const searchPattern = `%${query}%`;

    try {
      const result = await this.database?.executeSql(searchQuery, [searchPattern, searchPattern]);
      const tasks: Task[] = [];

      if (result && result[0].rows.length > 0) {
        for (let i = 0; i < result[0].rows.length; i++) {
          tasks.push(result[0].rows.item(i));
        }
      }

      return tasks;
    } catch (error) {
      console.error('Error searching tasks:', error);
      throw error;
    }
  }

  public async filterTasks(filter: TaskFilter): Promise<Task[]> {
    let query = 'SELECT * FROM tasks WHERE 1=1';
    const values: any[] = [];

    if (filter.status && filter.status !== 'all') {
      query += ' AND status = ?';
      values.push(filter.status);
    }

    if (filter.priority && filter.priority !== 'all') {
      query += ' AND priority = ?';
      values.push(filter.priority);
    }

    if (filter.searchQuery) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      const searchPattern = `%${filter.searchQuery}%`;
      values.push(searchPattern, searchPattern);
    }

    // Lọc theo danh mục
    if (filter.category_id) {
      if (filter.category_id === 'none') {
        // Lọc các task không có danh mục
        query += ' AND (category_id IS NULL OR category_id = 0)';
      } else if (filter.category_id !== 'all') {
        // Lọc theo danh mục cụ thể
        query += ' AND category_id = ?';
        values.push(filter.category_id);
      }
    }

    query += ' ORDER BY created_at DESC;';

    try {
      const result = await this.database?.executeSql(query, values);
      const tasks: Task[] = [];

      if (result && result[0].rows.length > 0) {
        for (let i = 0; i < result[0].rows.length; i++) {
          tasks.push(result[0].rows.item(i));
        }
      }

      return tasks;
    } catch (error) {
      console.error('Error filtering tasks:', error);
      throw error;
    }
  }

  public async getSettings(): Promise<AppSettings> {
    const query = 'SELECT * FROM settings ORDER BY id DESC LIMIT 1;';

    try {
      const result = await this.database?.executeSql(query);
      if (result && result[0].rows.length > 0) {
        const settings = result[0].rows.item(0);
        return {
          id: settings.id,
          theme: settings.theme,
          notifications_enabled: Boolean(settings.notifications_enabled),
          language: settings.language || 'vi',
          last_updated: settings.last_updated,
        };
      }
      throw new Error('No settings found');
    } catch (error) {
      console.error('Error getting settings:', error);
      throw error;
    }
  }

  public async updateSettings(settings: Partial<AppSettings>): Promise<DatabaseResult> {
    const updateFields: string[] = [];
    const values: any[] = [];

    Object.entries(settings).forEach(([key, value]) => {
      if (key !== 'id' && value !== undefined) {
        updateFields.push(`${key} = ?`);
        // Convert boolean to integer for SQLite
        if (typeof value === 'boolean') {
          values.push(value ? 1 : 0);
        } else {
          values.push(value);
        }
      }
    });

    if (updateFields.length === 0) {
      throw new Error('No fields to update');
    }

    // Add last_updated timestamp
    updateFields.push('last_updated = ?');
    values.push(new Date().toISOString());

    const updateQuery = `UPDATE settings SET ${updateFields.join(', ')} WHERE id = (SELECT id FROM settings ORDER BY id DESC LIMIT 1);`;

    try {
      const result = await this.database?.executeSql(updateQuery, values);
      return {
        rowsAffected: result?.[0].rowsAffected || 0,
      };
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }

  // Category methods
  public async insertCategory(category: Omit<Category, 'id' | 'created_at'>): Promise<DatabaseResult> {
    const insertQuery = `
      INSERT INTO categories (name, color, icon, created_at)
      VALUES (?, ?, ?, ?);
    `;

    const createdAt = new Date().toISOString();
    const values = [
      category.name,
      category.color,
      category.icon || null,
      createdAt,
    ];

    try {
      const result = await this.database?.executeSql(insertQuery, values);
      return {
        insertId: result?.[0].insertId,
        rowsAffected: result?.[0].rowsAffected || 0,
      };
    } catch (error) {
      console.error('Error inserting category:', error);
      throw error;
    }
  }

  public async getAllCategories(): Promise<Category[]> {
    const selectQuery = 'SELECT * FROM categories ORDER BY name ASC;';

    try {
      const result = await this.database?.executeSql(selectQuery);
      const categories: Category[] = [];

      if (result && result[0].rows.length > 0) {
        for (let i = 0; i < result[0].rows.length; i++) {
          categories.push(result[0].rows.item(i));
        }
      }

      return categories;
    } catch (error) {
      console.error('Error getting all categories:', error);
      throw error;
    }
  }

  public async updateCategory(id: number, category: Partial<Category>): Promise<DatabaseResult> {
    const updateFields: string[] = [];
    const values: any[] = [];

    Object.entries(category).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at' && value !== undefined) {
        updateFields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (updateFields.length === 0) {
      throw new Error('No fields to update');
    }

    const updateQuery = `UPDATE categories SET ${updateFields.join(', ')} WHERE id = ?;`;
    values.push(id);

    try {
      const result = await this.database?.executeSql(updateQuery, values);
      return {
        rowsAffected: result?.[0].rowsAffected || 0,
      };
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  public async deleteCategory(id: number): Promise<DatabaseResult> {
    // First, update all tasks that use this category to have null category_id
    const updateTasksQuery = 'UPDATE tasks SET category_id = NULL WHERE category_id = ?;';
    
    // Then delete the category
    const deleteCategoryQuery = 'DELETE FROM categories WHERE id = ?;';

    try {
      // Start a transaction
      await this.database?.executeSql('BEGIN TRANSACTION;');
      
      // Update tasks
      await this.database?.executeSql(updateTasksQuery, [id]);
      
      // Delete category
      const result = await this.database?.executeSql(deleteCategoryQuery, [id]);
      
      // Commit the transaction
      await this.database?.executeSql('COMMIT;');
      
      return {
        rowsAffected: result?.[0].rowsAffected || 0,
      };
    } catch (error) {
      // Rollback in case of error
      await this.database?.executeSql('ROLLBACK;');
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  public async getTasksByCategory(categoryId: number): Promise<Task[]> {
    const selectQuery = 'SELECT * FROM tasks WHERE category_id = ? ORDER BY created_at DESC;';

    try {
      const result = await this.database?.executeSql(selectQuery, [categoryId]);
      const tasks: Task[] = [];

      if (result && result[0].rows.length > 0) {
        for (let i = 0; i < result[0].rows.length; i++) {
          tasks.push(result[0].rows.item(i));
        }
      }

      return tasks;
    } catch (error) {
      console.error('Error getting tasks by category:', error);
      throw error;
    }
  }

  public async updateTaskCategory(taskId: number, categoryId: number | null): Promise<DatabaseResult> {
    const updateQuery = 'UPDATE tasks SET category_id = ? WHERE id = ?;';

    try {
      const result = await this.database?.executeSql(updateQuery, [categoryId, taskId]);
      return {
        rowsAffected: result?.[0].rowsAffected || 0,
      };
    } catch (error) {
      console.error('Error updating task category:', error);
      throw error;
    }
  }

  // Tag methods
  public async insertTag(tag: Omit<Tag, 'id' | 'usage_count'>): Promise<DatabaseResult> {
    const insertQuery = `
      INSERT INTO tags (name, color, usage_count)
      VALUES (?, ?, 0);
    `;

    const values = [
      tag.name,
      tag.color,
    ];

    try {
      const result = await this.database?.executeSql(insertQuery, values);
      return {
        insertId: result?.[0].insertId,
        rowsAffected: result?.[0].rowsAffected || 0,
      };
    } catch (error) {
      console.error('Error inserting tag:', error);
      throw error;
    }
  }

  public async getAllTags(): Promise<Tag[]> {
    const selectQuery = 'SELECT * FROM tags ORDER BY name ASC;';

    try {
      const result = await this.database?.executeSql(selectQuery);
      const tags: Tag[] = [];

      if (result && result[0].rows.length > 0) {
        for (let i = 0; i < result[0].rows.length; i++) {
          tags.push(result[0].rows.item(i));
        }
      }

      return tags;
    } catch (error) {
      console.error('Error getting all tags:', error);
      throw error;
    }
  }

  public async updateTag(id: number, tag: Partial<Tag>): Promise<DatabaseResult> {
    const updateFields: string[] = [];
    const values: any[] = [];

    Object.entries(tag).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'usage_count' && value !== undefined) {
        updateFields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (updateFields.length === 0) {
      throw new Error('No fields to update');
    }

    const updateQuery = `UPDATE tags SET ${updateFields.join(', ')} WHERE id = ?;`;
    values.push(id);

    try {
      const result = await this.database?.executeSql(updateQuery, values);
      return {
        rowsAffected: result?.[0].rowsAffected || 0,
      };
    } catch (error) {
      console.error('Error updating tag:', error);
      throw error;
    }
  }

  public async deleteTag(id: number): Promise<DatabaseResult> {
    // Delete tag from task_tags table first (cascade should handle this, but just to be safe)
    const deleteTaskTagsQuery = 'DELETE FROM task_tags WHERE tag_id = ?;';
    
    // Then delete the tag
    const deleteTagQuery = 'DELETE FROM tags WHERE id = ?;';

    try {
      // Start a transaction
      await this.database?.executeSql('BEGIN TRANSACTION;');
      
      // Delete from task_tags
      await this.database?.executeSql(deleteTaskTagsQuery, [id]);
      
      // Delete tag
      const result = await this.database?.executeSql(deleteTagQuery, [id]);
      
      // Commit the transaction
      await this.database?.executeSql('COMMIT;');
      
      return {
        rowsAffected: result?.[0].rowsAffected || 0,
      };
    } catch (error) {
      // Rollback in case of error
      await this.database?.executeSql('ROLLBACK;');
      console.error('Error deleting tag:', error);
      throw error;
    }
  }

  public async getTagsForTask(taskId: number): Promise<Tag[]> {
    const selectQuery = `
      SELECT t.* FROM tags t
      JOIN task_tags tt ON t.id = tt.tag_id
      WHERE tt.task_id = ?
      ORDER BY t.name ASC;
    `;

    try {
      const result = await this.database?.executeSql(selectQuery, [taskId]);
      const tags: Tag[] = [];

      if (result && result[0].rows.length > 0) {
        for (let i = 0; i < result[0].rows.length; i++) {
          tags.push(result[0].rows.item(i));
        }
      }
      
      return tags;
    } catch (error) {
      console.error('Error getting tags for task:', error);
      throw error;
    }
  }

  public async addTagToTask(taskId: number, tagId: number): Promise<DatabaseResult> {
    // First check if the relationship already exists
    const checkQuery = 'SELECT COUNT(*) as count FROM task_tags WHERE task_id = ? AND tag_id = ?;';
    
    try {
      const checkResult = await this.database?.executeSql(checkQuery, [taskId, tagId]);
      const count = checkResult?.[0].rows.item(0).count;
      
      if (count > 0) {
        // Relationship already exists
        return { rowsAffected: 0 };
      }
      
      // Insert the relationship
      const insertQuery = 'INSERT INTO task_tags (task_id, tag_id) VALUES (?, ?);';
      const result = await this.database?.executeSql(insertQuery, [taskId, tagId]);
      
      // Increment the usage_count for the tag
      await this.database?.executeSql('UPDATE tags SET usage_count = usage_count + 1 WHERE id = ?;', [tagId]);
      
      return {
        rowsAffected: result?.[0].rowsAffected || 0,
      };
    } catch (error) {
      console.error('Error adding tag to task:', error);
      throw error;
    }
  }

  public async removeTagFromTask(taskId: number, tagId: number): Promise<DatabaseResult> {
    const deleteQuery = 'DELETE FROM task_tags WHERE task_id = ? AND tag_id = ?;';
    
    try {
      const result = await this.database?.executeSql(deleteQuery, [taskId, tagId]);
      
      if (result?.[0].rowsAffected > 0) {
        // Decrement the usage_count for the tag
        await this.database?.executeSql('UPDATE tags SET usage_count = MAX(0, usage_count - 1) WHERE id = ?;', [tagId]);
      }
      
      return {
        rowsAffected: result?.[0].rowsAffected || 0,
      };
    } catch (error) {
      console.error('Error removing tag from task:', error);
      throw error;
    }
  }

  public async getTasksByTag(tagId: number): Promise<Task[]> {
    const selectQuery = `
      SELECT t.* FROM tasks t
      JOIN task_tags tt ON t.id = tt.task_id
      WHERE tt.tag_id = ?
      ORDER BY t.created_at DESC;
    `;

    try {
      const result = await this.database?.executeSql(selectQuery, [tagId]);
      const tasks: Task[] = [];

      if (result && result[0].rows.length > 0) {
        for (let i = 0; i < result[0].rows.length; i++) {
          tasks.push(result[0].rows.item(i));
        }
      }

      return tasks;
    } catch (error) {
      console.error('Error getting tasks by tag:', error);
      throw error;
    }
  }

  // Project methods
  public async insertProject(project: Omit<Project, 'id'>): Promise<DatabaseResult> {
    const insertQuery = `
      INSERT INTO projects (name, description, start_date, end_date, status, color, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    const values = [
      project.name,
      project.description || null,
      project.start_date || null,
      project.end_date || null,
      project.status,
      project.color || null,
      project.created_at || new Date().toISOString(),
    ];

    try {
      const result = await this.database?.executeSql(insertQuery, values);
      return {
        insertId: result?.[0].insertId,
        rowsAffected: result?.[0].rowsAffected || 0,
      };
    } catch (error) {
      console.error('Error inserting project:', error);
      throw error;
    }
  }

  public async getAllProjects(): Promise<Project[]> {
    const selectQuery = 'SELECT * FROM projects ORDER BY created_at DESC;';

    try {
      const result = await this.database?.executeSql(selectQuery);
      const projects: Project[] = [];

      if (result && result[0].rows.length > 0) {
        for (let i = 0; i < result[0].rows.length; i++) {
          projects.push(result[0].rows.item(i));
        }
      }

      return projects;
    } catch (error) {
      console.error('Error getting all projects:', error);
      throw error;
    }
  }

  public async getProject(id: number): Promise<Project | null> {
    const selectQuery = 'SELECT * FROM projects WHERE id = ?;';

    try {
      const result = await this.database?.executeSql(selectQuery, [id]);

      if (result && result[0].rows.length > 0) {
        return result[0].rows.item(0);
      }

      return null;
    } catch (error) {
      console.error('Error getting project:', error);
      throw error;
    }
  }

  public async updateProject(id: number, project: Partial<Project>): Promise<DatabaseResult> {
    const updateFields: string[] = [];
    const values: any[] = [];

    Object.entries(project).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at' && value !== undefined) {
        updateFields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (updateFields.length === 0) {
      throw new Error('No fields to update');
    }

    const updateQuery = `UPDATE projects SET ${updateFields.join(', ')} WHERE id = ?;`;
    values.push(id);

    try {
      const result = await this.database?.executeSql(updateQuery, values);
      return {
        rowsAffected: result?.[0].rowsAffected || 0,
      };
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  public async deleteProject(id: number): Promise<DatabaseResult> {
    // First, update all tasks that use this project to have null project_id
    const updateTasksQuery = 'UPDATE tasks SET project_id = NULL WHERE project_id = ?;';
    
    // Then delete the project
    const deleteProjectQuery = 'DELETE FROM projects WHERE id = ?;';

    try {
      // Start a transaction
      await this.database?.executeSql('BEGIN TRANSACTION;');
      
      // Update tasks
      await this.database?.executeSql(updateTasksQuery, [id]);
      
      // Delete project
      const result = await this.database?.executeSql(deleteProjectQuery, [id]);
      
      // Commit the transaction
      await this.database?.executeSql('COMMIT;');
      
      return {
        rowsAffected: result?.[0].rowsAffected || 0,
      };
    } catch (error) {
      // Rollback in case of error
      await this.database?.executeSql('ROLLBACK;');
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  public async getTasksByProject(projectId: number): Promise<Task[]> {
    const selectQuery = 'SELECT * FROM tasks WHERE project_id = ? ORDER BY created_at DESC;';

    try {
      const result = await this.database?.executeSql(selectQuery, [projectId]);
      const tasks: Task[] = [];

      if (result && result[0].rows.length > 0) {
        for (let i = 0; i < result[0].rows.length; i++) {
          tasks.push(result[0].rows.item(i));
        }
      }

      return tasks;
    } catch (error) {
      console.error('Error getting tasks by project:', error);
      throw error;
    }
  }

  public async updateTaskProject(taskId: number, projectId: number | null): Promise<DatabaseResult> {
    const updateQuery = 'UPDATE tasks SET project_id = ? WHERE id = ?;';

    try {
      const result = await this.database?.executeSql(updateQuery, [projectId, taskId]);
      return {
        rowsAffected: result?.[0].rowsAffected || 0,
      };
    } catch (error) {
      console.error('Error updating task project:', error);
      throw error;
    }
  }

  // Subtask methods
  public async getSubtasks(parentTaskId: number): Promise<Task[]> {
    const selectQuery = 'SELECT * FROM tasks WHERE parent_task_id = ? ORDER BY created_at ASC;';

    try {
      const result = await this.database?.executeSql(selectQuery, [parentTaskId]);
      const subtasks: Task[] = [];

      if (result && result[0].rows.length > 0) {
        for (let i = 0; i < result[0].rows.length; i++) {
          subtasks.push(result[0].rows.item(i));
        }
      }

      return subtasks;
    } catch (error) {
      console.error('Error getting subtasks:', error);
      throw error;
    }
  }

  public async updateTaskCompletion(taskId: number, completionPercentage: number): Promise<DatabaseResult> {
    const updateQuery = 'UPDATE tasks SET completion_percentage = ? WHERE id = ?;';

    try {
      const result = await this.database?.executeSql(updateQuery, [completionPercentage, taskId]);
      return {
        rowsAffected: result?.[0].rowsAffected || 0,
      };
    } catch (error) {
      console.error('Error updating task completion:', error);
      throw error;
    }
  }

  public async calculateParentCompletion(parentTaskId: number): Promise<number> {
    // Get all subtasks for the parent task
    const subtasks = await this.getSubtasks(parentTaskId);
    
    if (subtasks.length === 0) {
      return 0;
    }
    
    // Calculate the average completion percentage
    const totalCompletion = subtasks.reduce((sum, task) => {
      // If the task is completed, count it as 100%
      if (task.status === 'completed') {
        return sum + 100;
      }
      // Otherwise use the completion_percentage or 0 if not set
      return sum + (task.completion_percentage || 0);
    }, 0);
    
    const averageCompletion = Math.round(totalCompletion / subtasks.length);
    
    // Update the parent task's completion percentage
    await this.updateTaskCompletion(parentTaskId, averageCompletion);
    
    return averageCompletion;
  }

  public async closeDatabase(): Promise<void> {
    try {
      if (this.database) {
        await this.database.close();
        this.database = null;
        console.log('Database closed successfully');
      }
    } catch (error) {
      console.error('Error closing database:', error);
      throw error;
    }
  }
}

export default DatabaseHelper;
