import * as SQLite from "expo-sqlite";

let db = null;

export const initDB = async () => {
  db = await SQLite.openDatabaseAsync("durico_app.db");
  // await db.execAsync(`DROP TABLE IF EXISTS worker;`);
  // await db.execAsync(`DROP TABLE IF EXISTS amount`);
  await db.execAsync(`
    DROP TABLE IF EXISTS transaction_details;
    DROP TABLE IF EXISTS transactions;
    DROP TABLE IF EXISTS worker;
    DROP TABLE IF EXISTS amount;
  `);
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
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      is_hidden INTEGER NOT NULL DEFAULT 0,
      transaction_types INTEGER NOT NULL DEFAULT 0,
      total_summary INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS transaction_details (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      transaction_id INTEGER NOT NULL,
      column_index INTEGER NOT NULL,
      row_index INTEGER NOT NULL,
      worker_id INTEGER,
      worker_name TEXT,
      worker_color TEXT,
      weight INTEGER NOT NULL DEFAULT 0,
      result INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (transaction_id) REFERENCES transactions (id) ON DELETE CASCADE
    );
  `);

  return db;
};

export const getDB = () => db;
