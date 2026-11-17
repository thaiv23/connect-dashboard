const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const amount = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

const PREFIX_SYMBOLS: Record<string, string> = { EUR: "€", GBP: "£", USD: "$" };

export const LANGUAGE_NAMES: Record<string, string> = {
  de: "German",
  fr: "French",
  it: "Italian",
  es: "Spanish",
  fi: "Finnish",
  da: "Danish",
  en: "English",
};

/** Keeps the original currency, never converts. 400 EUR -> "€400", 3000 DKK -> "3,000 DKK". */
export function formatBudget(budget: number | null, currency: string | null): string {
  if (budget === null) return "Not specified";
  const value = amount.format(budget);
  if (!currency) return value;
  const symbol = PREFIX_SYMBOLS[currency];
  return symbol ? `${symbol}${value}` : `${value} ${currency}`;
}

/** "2026-11-16T10:30:00Z" -> "16 Nov 2026". UTC so server and client render identically. */
export function formatPublishedDate(iso: string | null): string {
  if (!iso) return "Unknown";
  const d = new Date(iso);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function formatPublishedTime(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")} UTC`;
}

export function formatPublishedFull(iso: string | null): string {
  if (!iso) return "Unknown";
  return `${formatPublishedDate(iso)}, ${formatPublishedTime(iso)}`;
}

/** Only http(s) URLs are ever rendered as links. */
export function parseSafeUrl(value: string | null): URL | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}
