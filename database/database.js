import * as SQLite from "expo-sqlite";

let db = null;

export const initDB = async () => {
  db = await SQLite.openDatabaseAsync("durico_app.db");
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS worker (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year INTEGER NOT NULL,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      total_weightning INTEGER NOT NULL,
      price INTEGER NOT NULL
    );
  `);

  return db;
};

export const getDB = () => db;