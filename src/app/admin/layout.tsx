import { AppShell } from "@/components/layout/app-shell";
import { ADMIN_ONLY, requireRole } from "@/server/auth/dal";

/** Admin area: keeps the Admin sidebar. ADMIN only (each page checks again). */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole(ADMIN_ONLY);
  return <AppShell>{children}</AppShell>;
}
