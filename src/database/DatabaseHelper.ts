import SQLite from 'react-native-sqlite-storage';
import { Task, TaskFilter, DatabaseResult } from '../types/Task';

// Enable promise for SQLite
SQLite.enablePromise(true);

class DatabaseHelper {
  private static instance: DatabaseHelper;
  private database: SQLite.SQLiteDatabase | null = null;

  private constructor() {}

  public static getInstance(): DatabaseHelper {
    if (!DatabaseHelper.instance) {
      DatabaseHelper.instance = new DatabaseHelper();
    }
    return DatabaseHelper.instance;
  }

  public async initDatabase(): Promise<SQLite.SQLiteDatabase> {
    try {
      if (!this.database) {
        this.database = await SQLite.openDatabase({
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
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        due_date TEXT,
        priority TEXT,
        status TEXT,
        created_at TEXT
      );
    `;

    try {
      await this.database?.executeSql(createTableQuery);
      console.log('Tasks table created successfully');
    } catch (error) {
      console.error('Error creating tasks table:', error);
      throw error;
    }
  }

  public async insertTask(task: Omit<Task, 'id' | 'created_at'>): Promise<DatabaseResult> {
    const insertQuery = `
      INSERT INTO tasks (title, description, due_date, priority, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?);
    `;

    const createdAt = new Date().toISOString();
    const values = [
      task.title,
      task.description || null,
      task.due_date || null,
      task.priority,
      task.status,
      createdAt,
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