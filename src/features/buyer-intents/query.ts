import type { BuyerIntent } from "./types";

/**
 * Pure filtering, sorting and paging. It runs in the browser for the prototype; the same
 * parameters map directly onto query-string parameters when this moves to the backend.
 */

export const ALL = "all";
export const UNKNOWN_COUNTRY = "__unknown_country__";
export const NO_BRAND = "__no_brand__";

export type BudgetFilter = "any" | "with" | "without";
export type SortKey = "newest" | "oldest" | "budget_asc" | "budget_desc";

export interface BuyerIntentFilters {
  search: string;
  country: string;
  brand: string;
  source: string;
  budget: BudgetFilter;
  /** yyyy-mm-dd (UTC), inclusive. Empty string means no bound. */
  dateFrom: string;
  dateTo: string;
}

export const DEFAULT_FILTERS: BuyerIntentFilters = {
  search: "",
  country: ALL,
  brand: ALL,
  source: ALL,
  budget: "any",
  dateFrom: "",
  dateTo: "",
};

export function hasActiveFilters(filters: BuyerIntentFilters) {
  return (Object.keys(DEFAULT_FILTERS) as (keyof BuyerIntentFilters)[]).some((key) => filters[key] !== DEFAULT_FILTERS[key]);
}

/** Case- and accent-insensitive, so "portatil" finds "portátil". */
const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

function matchesSearch(item: BuyerIntent, term: string) {
  const haystack = normalize(
    [item.post_title ?? "", item.buyer_intent, item.country ?? "", ...item.laptop_brands, ...item.laptop_models].join(" "),
  );
  return term.split(/\s+/).every((word) => haystack.includes(word));
}

export function filterBuyerIntents(items: BuyerIntent[], filters: BuyerIntentFilters): BuyerIntent[] {
  const term = normalize(filters.search.trim());

  return items.filter((item) => {
    if (term && !matchesSearch(item, term)) return false;

    if (filters.country !== ALL) {
      if (filters.country === UNKNOWN_COUNTRY ? item.country !== null : item.country !== filters.country) return false;
    }
    if (filters.brand !== ALL) {
      if (filters.brand === NO_BRAND ? item.laptop_brands.length > 0 : !item.laptop_brands.includes(filters.brand)) return false;
    }
    if (filters.source !== ALL && item.source_platform !== filters.source) return false;
    if (filters.budget === "with" && item.budget === null) return false;
    if (filters.budget === "without" && item.budget !== null) return false;

    if (filters.dateFrom || filters.dateTo) {
      // Records without a publication date cannot be placed in a range.
      if (!item.published_at) return false;
      const day = item.published_at.slice(0, 10);
      if (filters.dateFrom && day < filters.dateFrom) return false;
      if (filters.dateTo && day > filters.dateTo) return false;
    }
    return true;
  });
}

/**
 * Budgets are never converted, so budget sorting groups by currency first and then by amount.
 * Records without a budget (or publication date) always sort last.
 */
export function sortBuyerIntents(items: BuyerIntent[], sort: SortKey): BuyerIntent[] {
  const direction = sort === "newest" || sort === "budget_desc" ? -1 : 1;

  return [...items].sort((a, b) => {
    if (sort === "newest" || sort === "oldest") {
      if (a.published_at === null && b.published_at === null) return 0;
      if (a.published_at === null) return 1;
      if (b.published_at === null) return -1;
      return direction * a.published_at.localeCompare(b.published_at);
    }

    if (a.budget === null && b.budget === null) return 0;
    if (a.budget === null) return 1;
    if (b.budget === null) return -1;
    const currencyOrder = (a.currency ?? "").localeCompare(b.currency ?? "");
    if (currencyOrder !== 0) return currencyOrder;
    return direction * (a.budget - b.budget);
  });
}

export const PAGE_SIZES = [10, 25, 50] as const;

export function paginate<T>(items: T[], page: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * pageSize;
  return { page: current, totalPages, items: items.slice(start, start + pageSize), start, end: Math.min(start + pageSize, items.length) };
}
