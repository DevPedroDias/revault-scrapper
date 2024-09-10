import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function openDb () {
  const dbPath = path.join(process.env.APP_ROOT, 'tmp');

  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
  }

  return open({
    filename: path.join(dbPath, 'database.db'),
    driver: sqlite3.Database
  })
}

export async function initializeDb(): Promise<void> {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS search_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      status TEXT,
      input TEXT,
      search_quantity INTEGER,
      message TEXT,
      filename TEXT,
      created_at TEXT DEFAULT (DATETIME('now')),
      updated_at TEXT DEFAULT (DATETIME('now'))
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS sneakers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sku TEXT,
      name TEXT,
      log_id INTEGER,
      created_at TEXT DEFAULT (DATETIME('now')),
      updated_at TEXT DEFAULT (DATETIME('now')),
      FOREIGN KEY (log_id) REFERENCES search_log(id) ON DELETE CASCADE,
      CONSTRAINT unique_sku UNIQUE (sku)
    )
  `);
  await db.close();
}