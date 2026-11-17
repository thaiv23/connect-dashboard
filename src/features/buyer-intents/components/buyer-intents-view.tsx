"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { DataStatusBadge } from "@/features/dashboard/components/data-status-badge";
import { DEFAULT_FILTERS, filterBuyerIntents, hasActiveFilters, paginate, sortBuyerIntents, type BuyerIntentFilters, type SortKey } from "../query";
import { useLeadStates } from "../lead-state";
import type { BuyerIntentListResponse, SourcePlatform } from "../types";
import { BuyerIntentDetailDrawer } from "./buyer-intent-detail-drawer";
import { BuyerIntentTable } from "./buyer-intent-table";
import { BuyerIntentToolbar, type FilterOptions } from "./buyer-intent-toolbar";

const SOURCE_ORDER: SourcePlatform[] = ["Reddit", "Facebook Groups", "Local Forums", "Technology Communities", "Classified Communities"];

export function BuyerIntentsView({ initialData }: { initialData: BuyerIntentListResponse }) {
  const { items, dataStatus } = initialData;

  const [filters, setFilters] = React.useState<BuyerIntentFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = React.useState<SortKey>("newest");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [openId, setOpenId] = React.useState<string | null>(null);
  const leads = useLeadStates();

  const options = React.useMemo<FilterOptions>(() => {
    const countries = new Set<string>();
    const brands = new Set<string>();
    const sources = new Set<string>();
    for (const item of items) {
      if (item.country) countries.add(item.country);
      item.laptop_brands.forEach((b) => brands.add(b));
      sources.add(item.source_platform);
    }
    return {
      countries: [...countries].sort(),
      hasUnknownCountry: items.some((i) => i.country === null),
      brands: [...brands].sort(),
      hasUnbrandedPosts: items.some((i) => i.laptop_brands.length === 0),
      sources: SOURCE_ORDER.filter((s) => sources.has(s)),
    };
  }, [items]);

  const results = React.useMemo(() => sortBuyerIntents(filterBuyerIntents(items, filters), sort), [items, filters, sort]);
  const paged = paginate(results, page, pageSize);

  const savedIds = React.useMemo(() => new Set(items.filter((i) => leads.getState(i.id).saved).map((i) => i.id)), [items, leads]);
  const selected = items.find((i) => i.id === openId) ?? null;

  const changeFilters = (patch: Partial<BuyerIntentFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(1);
  };
  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  return (
    <>
      <PageHeader title="Buyer Intent Feed" subtitle="Laptop buyer requests collected from online communities" actions={<DataStatusBadge status={dataStatus} />} />

      <div className="mx-auto w-full max-w-[1600px] space-y-4 px-6 py-6 lg:px-8">
        {dataStatus === "demo" && (
          <div role="note" className="flex items-start gap-3 rounded-lg border border-brand-accent/25 bg-brand-accent/[0.06] px-4 py-3 text-[13px] leading-relaxed text-brand-navy">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
            <p>
              <span className="font-semibold">These buyer requests are fictional demo data.</span> They are not real posts or verified leads,
              and the post links are placeholders that do not open real posts.
            </p>
          </div>
        )}

        <BuyerIntentToolbar
          filters={filters}
          onFiltersChange={changeFilters}
          onClear={clearFilters}
          sort={sort}
          onSortChange={(next) => { setSort(next); setPage(1); }}
          options={options}
          resultCount={results.length}
          totalCount={items.length}
        />

        <BuyerIntentTable
          items={paged.items}
          sort={sort}
          onSortChange={(next) => { setSort(next); setPage(1); }}
          onOpen={setOpenId}
          selectedId={openId}
          savedIds={savedIds}
          onClearFilters={clearFilters}
          hasFilters={hasActiveFilters(filters)}
          pagination={{ page: paged.page, totalPages: paged.totalPages, start: paged.start, end: paged.end, total: results.length }}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
        />
      </div>

      <BuyerIntentDetailDrawer
        item={selected}
        leadState={selected ? leads.getState(selected.id) : leads.getState("")}
        onClose={() => setOpenId(null)}
        onUpdate={(patch) => selected && leads.update(selected.id, patch)}
        onAddActivity={(type, note) => selected && leads.addActivity(selected.id, type, note)}
      />
    </>
  );
}
