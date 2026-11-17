import type { CountryName, DateRangeKey, DateRangeOption } from "./types";

export const DEFAULT_DATE_RANGE: DateRangeKey = "30d";

/** Mock reference date. Replace with the real "today" once data comes from an API. */
export const MOCK_ANCHOR_DATE = "2026-11-16";

export const DATE_RANGES: DateRangeOption[] = [
  { key: "7d", label: "Last 7 days", description: "Nov 10 to Nov 16, 2026", comparison: "vs previous 7 days" },
  { key: "30d", label: "Last 30 days", description: "Oct 18 to Nov 16, 2026", comparison: "vs previous 30 days" },
  { key: "90d", label: "Last 90 days", description: "Aug 19 to Nov 16, 2026", comparison: "vs previous 90 days" },
  { key: "ytd", label: "Year to date", description: "Jan 1 to Nov 16, 2026", comparison: "vs same period last year" },
];

export const COUNTRY_CODES: Record<CountryName, string> = {
  Finland: "FI",
  Germany: "DE",
  Italy: "IT",
  Denmark: "DK",
  France: "FR",
  Spain: "ES",
};
