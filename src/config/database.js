import Database from 'better-sqlite3';

const db = new Database('data.db');

const migrate = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_name TEXT UNIQUE NOT NULL,
      total_seats INTEGER NOT NULL,
      available_seats INTEGER NOT NULL,
      registered_seats INTEGER NOT NULL DEFAULT 0,
      event_date TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_name TEXT NOT NULL,
      event_id INTEGER NOT NULL,
      status TEXT DEFAULT 'active',
      registered_at TEXT DEFAULT (datetime('now'))
    );
  `);
};

export { db, migrate };