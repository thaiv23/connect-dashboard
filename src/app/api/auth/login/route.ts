import { NextResponse, type NextRequest } from "next/server";

import { ROLE_HOME } from "@/features/auth/config";
import { isSameOrigin } from "@/server/auth/same-origin";
import { SESSION_COOKIE, createSession, deleteSession, sessionCookieOptions } from "@/server/auth/session";
import { authenticate } from "@/server/auth/users";

const INVALID_CREDENTIALS = "Incorrect username or password.";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request) || !request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const body: unknown = await request.json().catch(() => null);
  const fields = (body ?? {}) as { username?: unknown; password?: unknown };
  const username = typeof fields.username === "string" ? fields.username.trim() : "";
  const password = typeof fields.password === "string" ? fields.password : "";

  if (!username || !password) {
    return NextResponse.json({ error: "Enter your username and password." }, { status: 400 });
  }
  if (username.length > 128 || password.length > 1024) {
    return NextResponse.json({ error: INVALID_CREDENTIALS }, { status: 401 });
  }

  const user = await authenticate(username, password);
  if (!user) return NextResponse.json({ error: INVALID_CREDENTIALS }, { status: 401 });

  const previous = request.cookies.get(SESSION_COOKIE)?.value;
  if (previous) deleteSession(previous);

  const { token, expiresAt } = createSession(user.id);
  const response = NextResponse.json({ redirectTo: ROLE_HOME[user.role] });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(expiresAt));
  return response;
}
