"use client";

import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { formatCompact, formatNumber, formatPercent } from "@/lib/format";
import { ChartTooltip } from "./chart-tooltip";
import { CountryTag, DashboardCard } from "./dashboard-card";
import { COUNTRY_CODES } from "../constants";
import type { CountryLeadStats } from "../types";

const PALETTE = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--chart-6)"];

export function CountryDistributionChart({ countries }: { countries: CountryLeadStats[] }) {
  const slices = countries.map((c, i) => ({
    country: c.country,
    total: c.storeLeads + c.buyerIntentLeads,
    fill: PALETTE[i % PALETTE.length],
  }));
  const grandTotal = slices.reduce((sum, s) => sum + s.total, 0);

  return (
    <DashboardCard
      title="Leads Distribution by Country"
      description="Share of all store and buyer intent leads"
      className="h-full"
    >
      <div className="flex flex-col items-center gap-6 sm:flex-row xl:flex-col 2xl:flex-row">
        <div className="relative size-48 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<ChartTooltip />} />
              <Pie
                data={slices}
                dataKey="total"
                nameKey="country"
                innerRadius="64%"
                outerRadius="96%"
                paddingAngle={2}
                stroke="none"
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-muted-foreground">Total leads</span>
            <span className="text-xl font-semibold tabular-nums">{formatCompact(grandTotal)}</span>
          </div>
        </div>

        <ul className="w-full min-w-0 flex-1 space-y-2.5">
          {slices.map((slice) => (
            <li key={slice.country} className="flex items-center gap-2.5 text-[13px]">
              <span className="size-2.5 shrink-0 rounded-[3px]" style={{ background: slice.fill }} aria-hidden />
              <CountryTag code={COUNTRY_CODES[slice.country]} />
              <span className="min-w-0 flex-1 truncate">{slice.country}</span>
              <span className="text-muted-foreground tabular-nums">{formatNumber(slice.total)}</span>
              <span className="w-12 text-right font-semibold tabular-nums">{formatPercent((slice.total / grandTotal) * 100)}</span>
            </li>
          ))}
        </ul>
      </div>
    </DashboardCard>
  );
}
