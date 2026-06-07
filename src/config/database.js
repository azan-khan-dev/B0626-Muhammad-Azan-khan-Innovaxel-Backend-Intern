import Database from "better-sqlite3";
const db = new Database("event_registration.db");

const migrate = () => {
  db.exec(`
        CREATE TABLE IF NOT EXISTS users
         (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            total_seats INTEGER NOT NULL,
            registered_users INTEGER NOT NULL DEFAULT 0,
            event_registration_date TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS registrations
         (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_name TEXT NOT NULL,
            event_id INTEGER NOT NULL,
            status TEXT DEFAULT 'non-Active',
            registered_At TEXT DEFAULT (datetime('now'))
            );
        `);
};
export { db, migrate };
