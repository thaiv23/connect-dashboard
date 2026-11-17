import type { Metadata } from "next";

import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";
import { DEFAULT_DATE_RANGE } from "@/features/dashboard/constants";
import { getDashboardOverview } from "@/features/dashboard/api";
import { WORKSPACE_ROLES, requireRole } from "@/server/auth/dal";

export const metadata: Metadata = { title: "Dashboard Overview" };

export default async function WorkspaceOverviewPage() {
  await requireRole(WORKSPACE_ROLES);
  const initialData = await getDashboardOverview(DEFAULT_DATE_RANGE);
  return <DashboardOverview initialData={initialData} />;
}
