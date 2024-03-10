import * as SQLite from 'expo-sqlite';

const database_name = 'Test.db';

export const initDB = () => {
  const db = SQLite.openDatabase(database_name);
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        gender TEXT,
        fullName TEXT,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT,
        birthday TEXT,
        imageUri TEXT,
        phoneNumber TEXT,
        country TEXT,
        language TEXT
      );`,
      [],
      () => console.log('Table created successfully'),
      (_, error) => console.log('Error creating table:', error)
    );
    tx.executeSql(
      'SELECT COUNT(*) FROM Users',
      [],
      (_, { rows }) => {
        const count = rows.item(0)['COUNT(*)'];
        if (count === 0) {
          console.log('Table is empty');
        } else {
          console.log(`Table has ${count} rows`);
        }
      },
      (_, error) => console.log('Error counting rows:', error)
    );
  });
  return db;
};
