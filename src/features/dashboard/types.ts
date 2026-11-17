/**
 * API contract for the Dashboard Overview.
 * A future backend endpoint should return `DashboardOverviewData` as-is.
 */

export type DateRangeKey = "7d" | "30d" | "90d" | "ytd";

export type CountryName = "Finland" | "Germany" | "Italy" | "Denmark" | "France" | "Spain";

/** "demo" = simulated mock data. Switch to "live" only once real data is wired in. */
export type DataStatus = "demo" | "live";

export interface DateRangeOption {
  key: DateRangeKey;
  label: string;
  description: string;
  /** Used in KPI captions, e.g. "vs previous 7 days". */
  comparison: string;
}

export interface KpiMetric {
  id: "store-leads" | "buyer-intent-leads" | "target-countries" | "qualified-leads";
  label: string;
  value: number;
  /** Percentage change versus the comparison period. `null` when not applicable. */
  delta: number | null;
  comparison: string | null;
  /** Shown under the value when there is no delta. */
  caption?: string;
  note: string;
  /** Optional short tags shown in the card footer (used for the countries card). */
  chips?: string[];
  spark?: number[];
}

export interface CountryLeadStats {
  country: CountryName;
  storeLeads: number;
  buyerIntentLeads: number;
  qualifiedLeads: number;
}

export interface TrendPoint {
  label: string;
  storeLeads: number;
  buyerIntentLeads: number;
}

export type SourceId = "google-maps" | "trustpilot" | "facebook-groups" | "reddit" | "local-forums";

export interface SourcePerformance {
  id: SourceId;
  name: string;
  type: "store" | "intent";
  recordsCollected: number;
  delta: number;
  /** 0-100 */
  successRate: number;
  /** 0-100 */
  qualifiedRate: number;
}

export type ActivityCategory = "Store Discovery" | "Buyer Intent" | "Data Intelligence" | "Data Management";
export type ActivityStatus = "Completed" | "In progress" | "Scheduled" | "Needs review" | "Failed";
export type ActivitySource = SourcePerformance["name"] | "All sources";

export interface ActivityRecord {
  /** Simulated reference, always prefixed "SIM-". */
  id: string;
  activity: string;
  category: ActivityCategory;
  country: CountryName;
  source: ActivitySource;
  status: ActivityStatus;
  /** ISO-8601, UTC. */
  timestamp: string;
}

export interface DashboardOverviewData {
  range: DateRangeKey;
  dataStatus: DataStatus;
  kpis: KpiMetric[];
  countries: CountryLeadStats[];
  trend: TrendPoint[];
  sources: SourcePerformance[];
  activities: ActivityRecord[];
}
