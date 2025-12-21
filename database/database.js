import * as SQLite from "expo-sqlite";

let db = null;

export const initDB = async () => {
  db = await SQLite.openDatabaseAsync("durico_app.db");
  await db.execAsync(`DROP TABLE IF EXISTS worker;`);
  await db.execAsync(`DROP TABLE IF EXISTS price`)
  await db.execAsync(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS worker (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year INTEGER NOT NULL,
      create_at INTEGER NOT NULL,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      total_weightning INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS price (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year INTEGER NOT NULL,
      amount INTEGER NOT NULL,
      create_at INTEGER NOT NULL,
      update_at TEXT
    );
  `);

  return db;
};

export const getDB = () => db;