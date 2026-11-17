import { COUNTRY_CODES, DATE_RANGES, MOCK_ANCHOR_DATE } from "./constants";
import type {
  ActivityRecord,
  CountryLeadStats,
  DashboardOverviewData,
  DateRangeKey,
  KpiMetric,
  SourcePerformance,
  TrendPoint,
} from "./types";

/**
 * ALL VALUES IN THIS FILE ARE SIMULATED.
 * Nothing here comes from a database, API, crawler or automation engine.
 * Base figures describe the "last 30 days" window and are scaled for other ranges.
 */

const RANGE_FACTOR: Record<DateRangeKey, number> = { "7d": 0.23, "30d": 1, "90d": 2.85, ytd: 9.4 };

const BASE_COUNTRIES: CountryLeadStats[] = [
  { country: "Germany", storeLeads: 14820, buyerIntentLeads: 4980, qualifiedLeads: 3010 },
  { country: "France", storeLeads: 9640, buyerIntentLeads: 3420, qualifiedLeads: 1980 },
  { country: "Italy", storeLeads: 8310, buyerIntentLeads: 2860, qualifiedLeads: 1690 },
  { country: "Spain", storeLeads: 7150, buyerIntentLeads: 2740, qualifiedLeads: 1470 },
  { country: "Finland", storeLeads: 4730, buyerIntentLeads: 1720, qualifiedLeads: 880 },
  { country: "Denmark", storeLeads: 3970, buyerIntentLeads: 1665, qualifiedLeads: 812 },
];

type SourceBase = Omit<SourcePerformance, "delta"> & { deltas: Record<DateRangeKey, number> };

const BASE_SOURCES: SourceBase[] = [
  { id: "google-maps", name: "Google Maps", type: "store", recordsCollected: 31240, successRate: 97.8, qualifiedRate: 24.8, deltas: { "7d": 5.2, "30d": 11.6, "90d": 19.4, ytd: 34.1 } },
  { id: "trustpilot", name: "Trustpilot", type: "store", recordsCollected: 17380, successRate: 95.4, qualifiedRate: 19.7, deltas: { "7d": 3.1, "30d": 8.9, "90d": 14.2, ytd: 22.7 } },
  { id: "facebook-groups", name: "Facebook Groups", type: "intent", recordsCollected: 7420, successRate: 91.2, qualifiedRate: 16.3, deltas: { "7d": 9.8, "30d": 21.5, "90d": 33.0, ytd: 58.3 } },
  { id: "reddit", name: "Reddit", type: "intent", recordsCollected: 5960, successRate: 93.6, qualifiedRate: 18.9, deltas: { "7d": 7.4, "30d": 17.2, "90d": 26.8, ytd: 41.9 } },
  { id: "local-forums", name: "Local Forums", type: "intent", recordsCollected: 4005, successRate: 88.9, qualifiedRate: 14.2, deltas: { "7d": -1.8, "30d": 6.3, "90d": 10.7, ytd: 18.5 } },
];

const KPI_DELTAS: Record<DateRangeKey, { store: number; intent: number; qualified: number }> = {
  "7d": { store: 6.1, intent: 11.8, qualified: 4.3 },
  "30d": { store: 12.4, intent: 18.9, qualified: 8.7 },
  "90d": { store: 21.7, intent: 34.2, qualified: 15.9 },
  ytd: { store: 38.5, intent: 62.4, qualified: 29.6 },
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function daysBefore(anchor: string, days: number) {
  const d = new Date(`${anchor}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - days);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

/** Deterministic, gently rising series that sums to the given totals. */
function buildTrend(range: DateRangeKey, totalStore: number, totalIntent: number): TrendPoint[] {
  const config = {
    "7d": { points: 7, step: 1 },
    "30d": { points: 10, step: 3 },
    "90d": { points: 13, step: 7 },
    ytd: { points: 11, step: 0 },
  }[range];

  const labels: string[] = [];
  for (let i = 0; i < config.points; i++) {
    labels.push(range === "ytd" ? MONTHS[i] : daysBefore(MOCK_ANCHOR_DATE, (config.points - 1 - i) * config.step));
  }

  const weights = (seed: number) =>
    labels.map((_, i) => (0.75 + (0.5 * i) / (config.points - 1)) * (1 + 0.11 * Math.sin(i * 1.9 + seed)));

  const distribute = (total: number, w: number[]) => {
    const sum = w.reduce((a, b) => a + b, 0);
    const values = w.map((x) => Math.round((total * x) / sum));
    values[values.length - 1] += total - values.reduce((a, b) => a + b, 0);
    return values;
  };

  const store = distribute(totalStore, weights(0.4));
  const intent = distribute(totalIntent, weights(2.2));

  return labels.map((label, i) => ({ label, storeLeads: store[i], buyerIntentLeads: intent[i] }));
}

const ACTIVITIES: ActivityRecord[] = [
  { id: "SIM-2048", activity: "Store search: IT consulting firms", category: "Store Discovery", country: "Germany", source: "Google Maps", status: "Completed", timestamp: "2026-11-16T09:42:00Z" },
  { id: "SIM-2047", activity: "Buyer intent scan: ERP supplier requests", category: "Buyer Intent", country: "France", source: "Reddit", status: "Completed", timestamp: "2026-11-16T08:15:00Z" },
  { id: "SIM-2046", activity: "Review category sweep: logistics providers", category: "Store Discovery", country: "Finland", source: "Trustpilot", status: "In progress", timestamp: "2026-11-16T07:30:00Z" },
  { id: "SIM-2045", activity: "Lead scoring batch: new Italian leads", category: "Data Intelligence", country: "Italy", source: "All sources", status: "Completed", timestamp: "2026-11-15T17:05:00Z" },
  { id: "SIM-2044", activity: "Keyword sweep: packaging machinery", category: "Buyer Intent", country: "Germany", source: "Facebook Groups", status: "Failed", timestamp: "2026-11-15T14:48:00Z" },
  { id: "SIM-2043", activity: "Duplicate detection: Spanish store records", category: "Data Intelligence", country: "Spain", source: "All sources", status: "Needs review", timestamp: "2026-11-15T11:20:00Z" },
  { id: "SIM-2042", activity: "Forum thread monitoring: procurement requests", category: "Buyer Intent", country: "Denmark", source: "Local Forums", status: "Scheduled", timestamp: "2026-11-15T06:00:00Z" },
  { id: "SIM-2041", activity: "Export of qualified leads", category: "Data Management", country: "France", source: "All sources", status: "Completed", timestamp: "2026-11-14T16:32:00Z" },
];

export function buildMockOverview(range: DateRangeKey): DashboardOverviewData {
  const factor = RANGE_FACTOR[range];
  const scale = (n: number) => Math.round(n * factor);
  const comparison = DATE_RANGES.find((r) => r.key === range)!.comparison;

  const countries = BASE_COUNTRIES.map((c) => ({
    country: c.country,
    storeLeads: scale(c.storeLeads),
    buyerIntentLeads: scale(c.buyerIntentLeads),
    qualifiedLeads: scale(c.qualifiedLeads),
  }));

  const sources: SourcePerformance[] = BASE_SOURCES.map(({ deltas, ...s }) => ({
    ...s,
    recordsCollected: scale(s.recordsCollected),
    delta: deltas[range],
  }));

  const sum = (key: keyof Omit<CountryLeadStats, "country">) => countries.reduce((acc, c) => acc + c[key], 0);
  const totalStore = sum("storeLeads");
  const totalIntent = sum("buyerIntentLeads");
  const totalQualified = sum("qualifiedLeads");

  const trend = buildTrend(range, totalStore, totalIntent);
  const qualifiedRate = (totalQualified / (totalStore + totalIntent)) * 100;
  const deltas = KPI_DELTAS[range];

  const kpis: KpiMetric[] = [
    {
      id: "store-leads",
      label: "Total Store Leads",
      value: totalStore,
      delta: deltas.store,
      comparison,
      note: "Google Maps and Trustpilot",
      spark: trend.map((p) => p.storeLeads),
    },
    {
      id: "buyer-intent-leads",
      label: "Buyer Intent Leads",
      value: totalIntent,
      delta: deltas.intent,
      comparison,
      note: "Facebook Groups, Reddit and Local Forums",
      spark: trend.map((p) => p.buyerIntentLeads),
    },
    {
      id: "target-countries",
      label: "Target Countries",
      value: countries.length,
      delta: null,
      comparison: null,
      caption: `${countries.length} local languages monitored`,
      note: "Active markets",
      chips: Object.values(COUNTRY_CODES),
    },
    {
      id: "qualified-leads",
      label: "Qualified Leads",
      value: totalQualified,
      delta: deltas.qualified,
      comparison,
      note: `${qualifiedRate.toFixed(1)}% of all collected leads`,
      spark: trend.map((p, i) => Math.round((p.storeLeads + p.buyerIntentLeads) * (qualifiedRate / 100) * (0.92 + 0.08 * Math.sin(i * 1.3)))),
    },
  ];

  return {
    range,
    dataStatus: "demo",
    kpis,
    countries: [...countries].sort(
      (a, b) => b.storeLeads + b.buyerIntentLeads - (a.storeLeads + a.buyerIntentLeads),
    ),
    trend,
    sources,
    activities: ACTIVITIES,
  };
}
