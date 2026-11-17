import { NextResponse, type NextRequest } from "next/server";

import { LOGIN_PATH, SESSION_COOKIE } from "@/features/auth/config";

/**
 * Optimistic check only (no database): requests without a session cookie never reach protected pages.
 * Session validity and roles are enforced server-side by requireRole / authorizeApi in src/server/auth/dal.ts.
 */
export function proxy(request: NextRequest) {
  if (!request.cookies.has(SESSION_COOKIE)) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*", "/workspace/:path*"],
};
