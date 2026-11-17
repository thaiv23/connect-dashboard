"use client";

import { BadgeCheck, Globe, Store, Target, type LucideIcon } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { cn } from "@/lib/utils";
import { useDashboardOverview } from "../use-dashboard-overview";
import type { DashboardOverviewData, KpiMetric } from "../types";
import { CollectionTrendChart } from "./collection-trend-chart";
import { CountryDistributionChart } from "./country-distribution-chart";
import { SectionHeading } from "./dashboard-card";
import { DataStatusBadge } from "./data-status-badge";
import { DateRangeSelector } from "./date-range-selector";
import { DiscoveryVsIntentChart } from "./discovery-vs-intent-chart";
import { KpiCard } from "./kpi-card";
import { MarketSnapshot } from "./market-snapshot";
import { RecentActivities } from "./recent-activities";
import { SimulationNotice } from "./simulation-notice";
import { SourcePerformanceGrid } from "./source-performance";

const KPI_ICONS: Record<KpiMetric["id"], LucideIcon> = {
  "store-leads": Store,
  "buyer-intent-leads": Target,
  "target-countries": Globe,
  "qualified-leads": BadgeCheck,
};

export function DashboardOverview({ initialData }: { initialData: DashboardOverviewData }) {
  const { data, range, setRange, isLoading, error } = useDashboardOverview(initialData);

  return (
    <>
      <PageHeader
        title="Dashboard Overview"
        actions={
          <>
            <DataStatusBadge status={data.dataStatus} />
            <DateRangeSelector value={range} onChange={setRange} />
          </>
        }
      />

      <div
        aria-busy={isLoading}
        className={cn(
          "mx-auto w-full max-w-[1600px] space-y-8 px-6 py-6 transition-opacity duration-200 lg:px-8",
          isLoading && "opacity-60",
        )}
      >
        <div className="space-y-3">
          <SimulationNotice />
          {error && (
            <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
              {error}
            </p>
          )}
        </div>

        <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {data.kpis.map((metric) => (
            <KpiCard key={metric.id} metric={metric} icon={KPI_ICONS[metric.id]} />
          ))}
        </section>

        <section aria-labelledby="market-intelligence" className="space-y-4">
          <div id="market-intelligence">
            <SectionHeading title="Market Intelligence" description="How discovery and buyer intent compare across target countries" />
          </div>
          <div className="grid gap-4 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <DiscoveryVsIntentChart countries={data.countries} />
            </div>
            <div className="xl:col-span-5">
              <CountryDistributionChart countries={data.countries} />
            </div>
            <div className="xl:col-span-8">
              <CollectionTrendChart data={data.trend} />
            </div>
            <div className="xl:col-span-4">
              <MarketSnapshot countries={data.countries} />
            </div>
          </div>
        </section>

        <section aria-labelledby="source-performance" className="space-y-4">
          <div id="source-performance">
            <SectionHeading title="Data Sources Performance" description="Records collected, success and qualification rates by source" />
          </div>
          <SourcePerformanceGrid sources={data.sources} />
        </section>

        <section aria-label="Recent activities">
          <RecentActivities activities={data.activities} />
        </section>
      </div>
    </>
  );
}
