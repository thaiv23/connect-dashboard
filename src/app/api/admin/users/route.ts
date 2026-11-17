import { ADMIN_ONLY, authorizeApi } from "@/server/auth/dal";
import { listUsers } from "@/server/auth/users";

/** User management (read). ADMIN only; password hashes are never returned. */
export async function GET() {
  const auth = await authorizeApi(ADMIN_ONLY);
  if (!auth.ok) return auth.response;

  return Response.json({
    users: listUsers().map((u) => ({ ...u, createdAt: new Date(u.createdAt).toISOString() })),
  });
}
