import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT    NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT    NOT NULL,
    role          TEXT    NOT NULL CHECK (role IN ('ADMIN', 'USER')),
    created_at    INTEGER NOT NULL,
    updated_at    INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id         TEXT    PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions (user_id);
  CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions (expires_at);
`;

function open(): DatabaseSync {
  const file = process.env.DATABASE_PATH
    ? path.resolve(/* turbopackIgnore: true */ process.env.DATABASE_PATH)
    : path.join(process.cwd(), "data", "europe-intelligence.db");
  mkdirSync(path.dirname(file), { recursive: true });

  const db = new DatabaseSync(file);
  db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");
  db.exec(SCHEMA);
  return db;
}

const globalForDb = globalThis as unknown as { __europeIntelligenceDb?: DatabaseSync };

/** Single shared connection per server process (kept on globalThis so dev hot reloads do not leak handles). */
export function getDb(): DatabaseSync {
  globalForDb.__europeIntelligenceDb ??= open();
  return globalForDb.__europeIntelligenceDb;
}
