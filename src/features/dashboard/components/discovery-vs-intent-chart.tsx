"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { formatCompact, formatNumber, formatPercent } from "@/lib/format";
import { ChartTooltip } from "./chart-tooltip";
import { ChartLegend, DashboardCard } from "./dashboard-card";
import type { CountryLeadStats } from "../types";

const STORE = "var(--chart-1)";
const INTENT = "var(--chart-3)";
const AXIS_TICK = { fontSize: 12, fill: "var(--text-muted)" };

export function DiscoveryVsIntentChart({ countries }: { countries: CountryLeadStats[] }) {
  const store = countries.reduce((sum, c) => sum + c.storeLeads, 0);
  const intent = countries.reduce((sum, c) => sum + c.buyerIntentLeads, 0);
  const total = store + intent;

  return (
    <DashboardCard
      title="Store Discovery vs Buyer Intent"
      description="Leads collected per country, by discovery type"
      className="h-full"
      contentClassName="flex flex-col"
      action={
        <ChartLegend
          items={[
            { label: "Store Discovery", color: STORE },
            { label: "Buyer Intent", color: INTENT },
          ]}
        />
      }
    >
      <div className="mb-5 grid grid-cols-2 gap-4 sm:max-w-md">
        <div className="border-l-[3px] pl-3" style={{ borderColor: STORE }}>
          <p className="text-xs text-muted-foreground">Store Discovery</p>
          <p className="text-lg font-semibold tabular-nums">{formatNumber(store)}</p>
          <p className="text-xs text-muted-foreground tabular-nums">{formatPercent((store / total) * 100)} of leads</p>
        </div>
        <div className="border-l-[3px] pl-3" style={{ borderColor: INTENT }}>
          <p className="text-xs text-muted-foreground">Buyer Intent</p>
          <p className="text-lg font-semibold tabular-nums">{formatNumber(intent)}</p>
          <p className="text-xs text-muted-foreground tabular-nums">{formatPercent((intent / total) * 100)} of leads</p>
        </div>
      </div>

      <div className="relative min-h-64 w-full flex-1">
        <ResponsiveContainer width="100%" height="100%" className="absolute inset-0">
          <BarChart data={countries} margin={{ top: 4, right: 4, left: -8, bottom: 0 }} barGap={4} barCategoryGap="24%">
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis dataKey="country" tickLine={false} axisLine={false} tick={AXIS_TICK} />
            <YAxis tickLine={false} axisLine={false} tick={AXIS_TICK} tickFormatter={formatCompact} width={48} />
            <Tooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltip />} />
            <Bar dataKey="storeLeads" name="Store Discovery" fill={STORE} radius={[4, 4, 0, 0]} maxBarSize={28} />
            <Bar dataKey="buyerIntentLeads" name="Buyer Intent" fill={INTENT} radius={[4, 4, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}
