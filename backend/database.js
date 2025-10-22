import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const __dirname = path.resolve();

export async function openDb() {
  return open({
    filename: path.join(__dirname, 'database.db'),
    driver: sqlite3.Database
  });
}

export async function initDb() {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS conversions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_currency TEXT NOT NULL,
      to_currency TEXT NOT NULL,
      amount REAL NOT NULL,
      result REAL NOT NULL,
      rate REAL NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
  return db;
}
