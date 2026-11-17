import { DEFAULT_DATE_RANGE } from "./constants";
import { buildMockOverview } from "./mock-data";
import type { DashboardOverviewData, DateRangeKey } from "./types";

/**
 * Data access for the Dashboard Overview.
 *
 * Today this resolves simulated data from `mock-data.ts`. When a backend exists, replace the body
 * with a real request and keep the signature, so no component has to change:
 *
 *   const res = await fetch(`/api/v1/dashboard/overview?range=${range}`, { cache: "no-store" });
 *   if (!res.ok) throw new Error("Failed to load dashboard overview");
 *   return (await res.json()) as DashboardOverviewData;
 */
export async function getDashboardOverview(range: DateRangeKey = DEFAULT_DATE_RANGE): Promise<DashboardOverviewData> {
  return buildMockOverview(range);
}
