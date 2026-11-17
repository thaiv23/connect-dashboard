"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { formatCompact } from "@/lib/format";
import { ChartTooltip } from "./chart-tooltip";
import { ChartLegend, DashboardCard } from "./dashboard-card";
import type { TrendPoint } from "../types";

const STORE = "var(--chart-1)";
const INTENT = "var(--chart-3)";
const AXIS_TICK = { fontSize: 12, fill: "var(--text-muted)" };

export function CollectionTrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <DashboardCard
      title="Data Collection Trend"
      description="Leads collected over the selected period (simulated)"
      className="h-full"
      action={
        <ChartLegend
          items={[
            { label: "Store Discovery", color: STORE },
            { label: "Buyer Intent", color: INTENT },
          ]}
        />
      }
    >
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={AXIS_TICK} minTickGap={24} />
            <YAxis tickLine={false} axisLine={false} tick={AXIS_TICK} tickFormatter={formatCompact} width={48} />
            <Tooltip cursor={{ stroke: "var(--input)" }} content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="storeLeads"
              name="Store Discovery"
              stroke={STORE}
              strokeWidth={2}
              fill={STORE}
              fillOpacity={0.08}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Area
              type="monotone"
              dataKey="buyerIntentLeads"
              name="Buyer Intent"
              stroke={INTENT}
              strokeWidth={2}
              fill={INTENT}
              fillOpacity={0.1}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}
