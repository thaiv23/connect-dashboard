import type { Role } from "@/features/auth/config";
import { createUserIfMissing } from "./users";

/**
 * Creates the default accounts when they do not exist yet. Passwords come only from the environment
 * (.env.local, never committed); existing accounts are left untouched, so a changed password is kept.
 */
export async function seedDefaultUsers() {
  const accounts: Array<{ username: string; password: string | undefined; role: Role; passwordVar: string }> = [
    { username: process.env.DEFAULT_ADMIN_USERNAME || "admin", password: process.env.DEFAULT_ADMIN_PASSWORD, role: "ADMIN", passwordVar: "DEFAULT_ADMIN_PASSWORD" },
    { username: process.env.DEFAULT_USER_USERNAME || "user_avs", password: process.env.DEFAULT_USER_PASSWORD, role: "USER", passwordVar: "DEFAULT_USER_PASSWORD" },
  ];

  for (const { username, password, role, passwordVar } of accounts) {
    if (!password) {
      console.warn(`[auth] ${passwordVar} is not set; default ${role} account "${username}" is not created if missing.`);
      continue;
    }
    if (await createUserIfMissing(username, password, role)) {
      console.info(`[auth] Created default ${role} account "${username}".`);
    }
  }
}
