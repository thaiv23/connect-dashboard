"use client";

import * as React from "react";
import { FilterX, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ALL, NO_BRAND, UNKNOWN_COUNTRY, hasActiveFilters, type BudgetFilter, type BuyerIntentFilters, type SortKey } from "../query";

export interface FilterOptions {
  countries: string[];
  hasUnknownCountry: boolean;
  brands: string[];
  hasUnbrandedPosts: boolean;
  sources: string[];
}

interface ToolbarProps {
  filters: BuyerIntentFilters;
  onFiltersChange: (patch: Partial<BuyerIntentFilters>) => void;
  onClear: () => void;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
  options: FilterOptions;
  resultCount: number;
  totalCount: number;
}

function Field({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={cn("flex min-w-[150px] flex-1 flex-col gap-1", className)}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export function BuyerIntentToolbar({ filters, onFiltersChange, onClear, sort, onSortChange, options, resultCount, totalCount }: ToolbarProps) {
  const active = hasActiveFilters(filters);

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-end gap-3">
        <Field label="Search" className="min-w-[260px] flex-[2]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              type="search"
              value={filters.search}
              onChange={(e) => onFiltersChange({ search: e.target.value })}
              placeholder="Search requests, laptop brands or countries"
              className="pl-9"
            />
          </div>
        </Field>
        <Field label="Sort by" className="max-w-[240px]">
          <Select value={sort} onChange={(e) => onSortChange(e.target.value as SortKey)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="budget_asc">Budget: low to high</option>
            <option value="budget_desc">Budget: high to low</option>
          </Select>
        </Field>
      </div>

      <div className="mt-3 flex flex-wrap items-end gap-3">
        <Field label="Country">
          <Select value={filters.country} onChange={(e) => onFiltersChange({ country: e.target.value })}>
            <option value={ALL}>All countries</option>
            {options.countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
            {options.hasUnknownCountry && <option value={UNKNOWN_COUNTRY}>Unknown country</option>}
          </Select>
        </Field>
        <Field label="Laptop brand">
          <Select value={filters.brand} onChange={(e) => onFiltersChange({ brand: e.target.value })}>
            <option value={ALL}>All brands</option>
            {options.brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
            {options.hasUnbrandedPosts && <option value={NO_BRAND}>Brand not identified</option>}
          </Select>
        </Field>
        <Field label="Source">
          <Select value={filters.source} onChange={(e) => onFiltersChange({ source: e.target.value })}>
            <option value={ALL}>All sources</option>
            {options.sources.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </Field>
        <Field label="Budget">
          <Select value={filters.budget} onChange={(e) => onFiltersChange({ budget: e.target.value as BudgetFilter })}>
            <option value="any">Any</option>
            <option value="with">Budget specified</option>
            <option value="without">No budget</option>
          </Select>
        </Field>
        <Field label="Published from" className="max-w-[170px]">
          <Input type="date" value={filters.dateFrom} max={filters.dateTo || undefined} onChange={(e) => onFiltersChange({ dateFrom: e.target.value })} />
        </Field>
        <Field label="Published to" className="max-w-[170px]">
          <Input type="date" value={filters.dateTo} min={filters.dateFrom || undefined} onChange={(e) => onFiltersChange({ dateTo: e.target.value })} />
        </Field>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t pt-3">
        <p className="text-[13px] text-muted-foreground" aria-live="polite">
          <span className="font-semibold text-foreground tabular-nums">{resultCount}</span>{" "}
          {resultCount === 1 ? "result" : "results"}
          {resultCount !== totalCount && <span className="tabular-nums"> of {totalCount}</span>}
          {(sort === "budget_asc" || sort === "budget_desc") && (
            <span> (budgets are sorted within each currency, nothing is converted)</span>
          )}
        </p>
        <Button variant="ghost" size="sm" onClick={onClear} disabled={!active}>
          <FilterX />
          Clear all filters
        </Button>
      </div>
    </Card>
  );
}
