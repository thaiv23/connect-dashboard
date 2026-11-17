import { WORKSPACE_ROLES, authorizeApi, getSession } from "@/server/auth/dal";

/** Current account for any signed-in role. */
export async function GET() {
  const auth = await authorizeApi(WORKSPACE_ROLES);
  if (!auth.ok) return auth.response;

  const session = await getSession();
  const expiresAt = session.status === "valid" ? new Date(session.expiresAt).toISOString() : null;
  return Response.json({ user: { username: auth.user.username, role: auth.user.role }, expiresAt });
}
