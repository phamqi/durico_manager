import * as SQLite from "expo-sqlite";

let db = null;

export const initDB = async () => {
  db = await SQLite.openDatabaseAsync("durico_app.db");
  await db.execAsync(`DROP TABLE IF EXISTS worker;`);
  await db.execAsync(`DROP TABLE IF EXISTS amount`);
  await db.execAsync(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS worker (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year TEXT NOT NULL,
      create_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      total_weightning INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS amount (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year TEXT UNIQUE NOT NULL,
      amount INTEGER NOT NULL,
      create_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      update_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  return db;
};

export const getDB = () => db;
