import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { WORKSPACE_ROLES, requireRole } from "@/server/auth/dal";

/** User Workspace: its own sidebar, separate from the Admin sidebar. Each page checks the session again. */
export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  await requireRole(WORKSPACE_ROLES);
  return <WorkspaceShell>{children}</WorkspaceShell>;
}
