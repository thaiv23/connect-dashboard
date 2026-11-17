import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { LOGIN_PATH, ROLE_HOME, type Role } from "@/features/auth/config";
import { SESSION_COOKIE, validateSessionToken, type SessionCheck } from "./session";
import type { AuthUser } from "./users";

/** Authoritative session check against the database, memoized per request. */
export const getSession = cache(async (): Promise<SessionCheck | { status: "anonymous" }> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? validateSessionToken(token) : { status: "anonymous" };
});

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getSession();
  return session.status === "valid" ? session.user : null;
}

/**
 * Page/layout guard. Call it in every protected page, not only in layouts: layouts do not re-render on client
 * navigation. Unauthenticated -> /login, expired -> /login?expired=1, wrong role -> the user's own home.
 */
export async function requireRole(allowed: readonly Role[]): Promise<AuthUser> {
  const session = await getSession();
  if (session.status === "expired") redirect(`${LOGIN_PATH}?expired=1`);
  if (session.status !== "valid") redirect(LOGIN_PATH);
  if (!allowed.includes(session.user.role)) redirect(ROLE_HOME[session.user.role]);
  return session.user;
}

type ApiAuthResult = { ok: true; user: AuthUser } | { ok: false; response: Response };

/** Route Handler guard: 401 without a valid session, 403 for a role that is not allowed. */
export async function authorizeApi(allowed: readonly Role[]): Promise<ApiAuthResult> {
  const session = await getSession();
  if (session.status !== "valid") {
    const error = session.status === "expired" ? "Session expired" : "Authentication required";
    return { ok: false, response: Response.json({ error }, { status: 401 }) };
  }
  if (!allowed.includes(session.user.role)) {
    return { ok: false, response: Response.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true, user: session.user };
}

export const ADMIN_ONLY: readonly Role[] = ["ADMIN"];
/** The workspace is the USER area; ADMIN keeps full access to it. */
export const WORKSPACE_ROLES: readonly Role[] = ["USER", "ADMIN"];
