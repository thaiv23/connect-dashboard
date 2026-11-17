const full = new Intl.NumberFormat("en-US");
const compact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const formatNumber = (n: number) => full.format(n);
export const formatCompact = (n: number) => compact.format(n);
export const formatPercent = (n: number, digits = 1) => `${n.toFixed(digits)}%`;
export const formatDelta = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;

/** "2026-11-16T09:42:00Z" -> "Nov 16, 09:42" (UTC, locale-independent so server and client render the same text). */
export function formatTimestamp(iso: string) {
  const d = new Date(iso);
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${hh}:${mm}`;
}
