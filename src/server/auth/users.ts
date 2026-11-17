import type { Role } from "@/features/auth/config";
import { getDb } from "../db";
import { hashPassword, verifyPassword } from "./password";

export interface AuthUser {
  id: number;
  username: string;
  role: Role;
}

interface UserRow {
  id: number;
  username: string;
  role: Role;
  password_hash: string;
}

let dummyHash: Promise<string> | undefined;

/** Checks a username/password pair. Unknown usernames still pay the hashing cost so timing does not reveal them. */
export async function authenticate(username: string, password: string): Promise<AuthUser | null> {
  const row = getDb()
    .prepare("SELECT id, username, role, password_hash FROM users WHERE username = ?")
    .get(username) as UserRow | undefined;

  if (!row) {
    dummyHash ??= hashPassword("not-a-real-password");
    await verifyPassword(password, await dummyHash);
    return null;
  }

  if (!(await verifyPassword(password, row.password_hash))) return null;
  return { id: row.id, username: row.username, role: row.role };
}

/** Inserts the account only when the username is free; an existing account (and its password and role) is never touched. */
export async function createUserIfMissing(username: string, password: string, role: Role): Promise<boolean> {
  const db = getDb();
  if (db.prepare("SELECT 1 FROM users WHERE username = ?").get(username)) return false;

  const now = Date.now();
  const result = db
    .prepare("INSERT OR IGNORE INTO users (username, password_hash, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?)")
    .run(username, await hashPassword(password), role, now, now);
  return result.changes > 0;
}

export function listUsers() {
  return getDb()
    .prepare("SELECT id, username, role, created_at AS createdAt FROM users ORDER BY id")
    .all() as Array<{ id: number; username: string; role: Role; createdAt: number }>;
}
