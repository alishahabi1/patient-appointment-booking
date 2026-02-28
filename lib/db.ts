import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const DB_PATH = path.join(dataDir, 'appointments.db');

let db: Database.Database;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema(db);
  }
  return db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS appointments (
      id                  INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_type        TEXT NOT NULL CHECK(patient_type IN ('new','existing')),
      first_name          TEXT NOT NULL,
      last_name           TEXT NOT NULL,
      phone               TEXT NOT NULL,
      email               TEXT,
      insurance_provider  TEXT,
      insurance_id        TEXT,
      reason              TEXT NOT NULL,
      appointment_dt      TEXT NOT NULL,
      created_at          TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_appointment_dt ON appointments(appointment_dt);
    CREATE INDEX IF NOT EXISTS idx_phone ON appointments(phone);
  `);
}

export default getDb;
