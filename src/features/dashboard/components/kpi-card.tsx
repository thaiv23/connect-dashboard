import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { formatNumber } from "@/lib/format";
import { CountryTag } from "./dashboard-card";
import { DeltaPill } from "./delta-pill";
import { Sparkline } from "./sparkline";
import type { KpiMetric } from "../types";

export function KpiCard({ metric, icon: Icon }: { metric: KpiMetric; icon: LucideIcon }) {
  return (
    <Card className="flex flex-col p-5 transition-shadow hover:shadow-md">
      <div className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-blue/10 text-brand-blue">
          <Icon className="size-5" aria-hidden />
        </span>
        <p className="text-[13px] font-medium text-muted-foreground">{metric.label}</p>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[30px] font-semibold leading-none tracking-tight text-foreground tabular-nums">
            {formatNumber(metric.value)}
          </p>
          {metric.delta !== null ? (
            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
              <DeltaPill value={metric.delta} />
              <span className="text-xs text-muted-foreground">{metric.comparison}</span>
            </div>
          ) : (
            metric.caption && <p className="mt-3 text-xs leading-5 text-muted-foreground">{metric.caption}</p>
          )}
        </div>
        {metric.spark && <Sparkline values={metric.spark} className="h-9 w-24 shrink-0 text-brand-blue" />}
      </div>

      <div className="mt-auto pt-4">
        <div className="border-t pt-3 text-xs text-muted-foreground">
          {metric.chips ? (
            <div className="flex flex-wrap items-center gap-1.5">
              {metric.chips.map((code) => (
                <CountryTag key={code} code={code} />
              ))}
              <span className="ml-1">{metric.note}</span>
            </div>
          ) : (
            metric.note
          )}
        </div>
      </div>
    </Card>
  );
}
