export type Role = "ADMIN" | "USER";

/** Landing page after login (and when an authenticated user opens /login or /). */
export const ROLE_HOME: Record<Role, string> = {
  ADMIN: "/admin/dashboard",
  USER: "/workspace/home",
};

export const LOGIN_PATH = "/login";

export const SESSION_COOKIE = "ei_session";
