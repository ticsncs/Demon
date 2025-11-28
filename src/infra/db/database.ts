import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import bcrypt from 'bcrypt';

let db: Database;

export async function initializeDatabase() {
  if (!db) {
    db = await open({
      filename: './src/infra/db/database.db',
      driver: sqlite3.Database
    });
  }

  await db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      url TEXT NOT NULL,
      token TEXT NOT NULL
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

  // Insert a default admin user if it doesn\'t exist
  const admin = await db.get('SELECT * FROM users WHERE username = ?', 'bherrera@nettplus.net');
  if (!admin) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('S3rv3r011ncs', salt);
    await db.run('INSERT INTO users (username, password) VALUES (?, ?)', 'bherrera@nettplus.net', hashedPassword);
  }

  return db;
}

export { db };
