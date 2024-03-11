import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('users.db');

export const setupDatabase = async () => {
  return new Promise((resolve, reject) => {
    const sqlStatements = [
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
      );`
    ];

    db.exec(sqlStatements, false, (error) => {
      if (error) {
        console.log('Error creating table:', error);
        reject(error);
      } else {
        console.log('Table created successfully');
        resolve(db); // Resolve the promise with the db object
      }
    });
  });
};

export const getAllUsers = async () => {
  return new Promise((resolve, reject) => {
    const sqlStatements = ['SELECT * FROM Users'];

    db.exec(sqlStatements, true, (error, resultSet) => {
      if (error) {
        console.log('Error fetching users:', error);
        reject(error);
      } else {
        const users = resultSet[0]?.rows;
        if (!users) {
          console.log('No users found');
          resolve([]);
        } else {
          resolve(users);
        }
      }
    });
  });
};