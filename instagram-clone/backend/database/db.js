import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(__dirname, '..', 'instagram_clone.db');

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('📚 Connected to SQLite database');
  }
});

// Initialize database tables
export async function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          full_name TEXT,
          bio TEXT,
          profile_picture TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Posts table
      db.run(`
        CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          image_url TEXT NOT NULL,
          caption TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
      `);

      // Likes table
      db.run(`
        CREATE TABLE IF NOT EXISTS likes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          post_id INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, post_id),
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
          FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
        )
      `);

      // Comments table
      db.run(`
        CREATE TABLE IF NOT EXISTS comments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          post_id INTEGER NOT NULL,
          content TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
          FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
        )
      `);

      // Follows table
      db.run(`
        CREATE TABLE IF NOT EXISTS follows (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          follower_id INTEGER NOT NULL,
          following_id INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(follower_id, following_id),
          FOREIGN KEY (follower_id) REFERENCES users (id) ON DELETE CASCADE,
          FOREIGN KEY (following_id) REFERENCES users (id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('✅ Database tables initialized successfully');
          resolve();
        }
      });
    });
  });
}

// Helper function to run queries with promises
export function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
}

// Helper function to get single row
export function getOne(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

// Helper function to get all rows
export function getAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

export default db;