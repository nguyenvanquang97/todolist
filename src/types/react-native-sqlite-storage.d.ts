declare module 'react-native-sqlite-storage' {
  namespace SQLite {
    interface SQLiteDatabase {
      executeSql(sqlStatement: string, params?: any[]): Promise<any[]>;
      close(): Promise<void>;
    }

    interface SQLiteOptions {
      name: string;
      location?: string;
      createFromLocation?: number;
    }
  }

  function openDatabase(options: SQLite.SQLiteOptions): Promise<SQLite.SQLiteDatabase>;
  function enablePromise(enabled: boolean): void;

  const SQLiteModule = {
    openDatabase,
    enablePromise,
  };

  export { SQLite };
  export default SQLiteModule;
}