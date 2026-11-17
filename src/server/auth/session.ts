import { createHash, randomBytes } from "node:crypto";

import { SESSION_COOKIE, type Role } from "@/features/auth/config";
import { getDb } from "../db";
import type { AuthUser } from "./users";

export { SESSION_COOKIE };
export const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

export type SessionCheck =
  | { status: "valid"; user: AuthUser; expiresAt: number }
  | { status: "expired" }
  | { status: "invalid" };

/** The cookie holds a random token; the database only stores its SHA-256, so a leaked database cannot be replayed. */
function sessionId(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createSession(userId: number) {
  const db = getDb();
  const now = Date.now();
  db.prepare("DELETE FROM sessions WHERE expires_at <= ?").run(now);

  const token = randomBytes(32).toString("base64url");
  const expiresAt = now + SESSION_TTL_MS;
  db.prepare("INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)").run(sessionId(token), userId, expiresAt, now);
  return { token, expiresAt };
}

/** Role and username are always read from the users table, never from the cookie. */
export function validateSessionToken(token: string): SessionCheck {
  const db = getDb();
  const id = sessionId(token);
  const row = db
    .prepare(
      `SELECT s.expires_at AS expiresAt, u.id, u.username, u.role
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.id = ?`,
    )
    .get(id) as { expiresAt: number; id: number; username: string; role: Role } | undefined;

  if (!row) return { status: "invalid" };
  if (row.expiresAt <= Date.now()) {
    db.prepare("DELETE FROM sessions WHERE id = ?").run(id);
    return { status: "expired" };
  }
  return { status: "valid", user: { id: row.id, username: row.username, role: row.role }, expiresAt: row.expiresAt };
}

export function deleteSession(token: string) {
  getDb().prepare("DELETE FROM sessions WHERE id = ?").run(sessionId(token));
}

export function sessionCookieOptions(expiresAt: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires: new Date(expiresAt),
  };
}
