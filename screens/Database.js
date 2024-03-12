import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('users.db');

export const setupDatabase = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((transaction) => {
      transaction.executeSql(
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
        (_, result) => {
          console.log('Table created successfully');
          resolve(db);
        },
        (_, error) => {
          console.log('Error creating table:', error);
          reject(error);
        }
      );
    });
  });
};

export const deleteAllUsers = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((transaction) => {
      transaction.executeSql(
        'DELETE FROM Users',
        [],
        (_, result) => {
          console.log('All users deleted successfully');
          resolve();
        },
        (_, error) => {
          console.log('Error deleting users:', error);
          reject(error);
        }
      );
    });
  });
};

export const getAllUsers = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((transaction) => {
      transaction.executeSql(
        'SELECT * FROM Users',
        [],
        (_, result) => {
          const users = result.rows?.length ? result.rows.raw() : [];
          resolve(users);
        },
        (_, error) => {
          console.log('Error fetching users:', error);
          reject(error);
        }
      );
    });
  });
};
