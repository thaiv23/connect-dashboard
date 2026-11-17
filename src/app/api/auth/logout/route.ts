import { NextResponse, type NextRequest } from "next/server";

import { LOGIN_PATH } from "@/features/auth/config";
import { isSameOrigin } from "@/server/auth/same-origin";
import { SESSION_COOKIE, deleteSession } from "@/server/auth/session";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (token) deleteSession(token);

  const response = NextResponse.json({ redirectTo: LOGIN_PATH });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
