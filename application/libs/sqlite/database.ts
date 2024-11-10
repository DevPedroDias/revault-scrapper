import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { app } from 'electron'; // Importa o objeto 'app' do Electron

export async function openDb () {
  // Usa o diretório de dados do usuário fornecido pelo Electron
  const dbPath = path.join(app.getPath('userData'), 'revault-data-tmp'); // Grava fora do app.asar

  // Verifica se o diretório existe, se não, cria o diretório
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
  }

  // Abre o banco de dados no caminho seguro do diretório de dados do usuário
  return open({
    filename: path.join(dbPath, 'database.db'),
    driver: sqlite3.Database
  });
}

export async function initializeDb(): Promise<void> {
  try {
    const db = await openDb();
    
    // Cria a tabela search_log, se não existir
    await db.exec(`
      CREATE TABLE IF NOT EXISTS searchs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        status TEXT,
        input TEXT,
        search_quantity INTEGER,
        message TEXT,
        created_at TEXT DEFAULT (DATETIME('now')),
        updated_at TEXT DEFAULT (DATETIME('now'))
      )
    `);

    // Cria a tabela sneakers, se não existir
    await db.exec(`
      CREATE TABLE IF NOT EXISTS sneakers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sku TEXT,
      name TEXT,
      price TEXT,
      description TEXT,
      imageLinks TEXT,
      releaseDate TEXT,
      brand TEXT,
      silhouette TEXT,
      releasePrice TEXT,
      color TEXT,
      search_id INTEGER,
      synced INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (DATETIME('now')),
      updated_at TEXT DEFAULT (DATETIME('now')),
      FOREIGN KEY (search_id) REFERENCES searchs(id) ON DELETE CASCADE,
      CONSTRAINT unique_sku UNIQUE (sku)
    );
  `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      api_key TEXT,
      created_at TEXT DEFAULT (DATETIME('now')),
      updated_at TEXT DEFAULT (DATETIME('now'))
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS syncs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    api_key TEXT,
    created_at TEXT DEFAULT (DATETIME('now')),
    updated_at TEXT DEFAULT (DATETIME('now'))
  );
  `);

    console.log('Banco de dados inicializado com sucesso.');
    await db.close();
  } catch (error) {
    console.error('Erro durante a inicialização do banco de dados:', error);
  }
}


// name
// price
// description
// imageLinks
// sku
// releaseDate
// brand
// silhouette
// releasePrice
// color