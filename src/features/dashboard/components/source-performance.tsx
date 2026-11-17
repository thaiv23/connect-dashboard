import { MapPin, MessageCircle, MessagesSquare, Star, Users, type LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { formatNumber, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import { DeltaPill } from "./delta-pill";
import type { SourceId, SourcePerformance } from "../types";

const SOURCE_ICONS: Record<SourceId, LucideIcon> = {
  "google-maps": MapPin,
  trustpilot: Star,
  "facebook-groups": Users,
  reddit: MessageCircle,
  "local-forums": MessagesSquare,
};

const TYPE_STYLES = {
  store: { label: "Store discovery", tile: "bg-brand-navy/10 text-brand-navy", bar: "bg-brand-navy" },
  intent: { label: "Buyer intent", tile: "bg-brand-accent/10 text-brand-accent", bar: "bg-brand-accent" },
} as const;

function MetricBar({ label, value, barClass }: { label: string; value: number; barClass: string }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold tabular-nums">{formatPercent(value)}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted" role="presentation">
        <div className={cn("h-full rounded-full transition-[width] duration-300", barClass)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function SourceCard({ source, totalRecords }: { source: SourcePerformance; totalRecords: number }) {
  const Icon = SOURCE_ICONS[source.id];
  const style = TYPE_STYLES[source.type];

  return (
    <Card className="p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", style.tile)}>
            <Icon className="size-[18px]" aria-hidden />
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold">{source.name}</p>
            <p className="text-xs text-muted-foreground">{style.label}</p>
          </div>
        </div>
        <DeltaPill value={source.delta} />
      </div>

      <p className="mt-4 text-2xl font-semibold tracking-tight tabular-nums">{formatNumber(source.recordsCollected)}</p>
      <p className="text-xs text-muted-foreground">
        records collected, {formatPercent((source.recordsCollected / totalRecords) * 100)} of the total
      </p>

      <div className="mt-4 space-y-3">
        <MetricBar label="Collection success" value={source.successRate} barClass={style.bar} />
        <MetricBar label="Qualified rate" value={source.qualifiedRate} barClass={style.bar} />
      </div>
    </Card>
  );
}

function SummaryCard({ sources, totalRecords }: { sources: SourcePerformance[]; totalRecords: number }) {
  const weighted = (key: "successRate" | "qualifiedRate") =>
    sources.reduce((sum, s) => sum + s.recordsCollected * s[key], 0) / totalRecords;

  return (
    <Card className="flex flex-col justify-between border-brand-navy bg-brand-navy p-5 text-white">
      <div>
        <p className="text-sm font-semibold">All sources</p>
        <p className="text-xs text-white/80">{sources.length} sources combined</p>
      </div>
      <div>
        <p className="mt-4 text-2xl font-semibold tracking-tight tabular-nums">{formatNumber(totalRecords)}</p>
        <p className="text-xs text-white/80">records collected</p>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-white/20 pt-4">
        <div>
          <dt className="text-xs text-white/80">Avg. success</dt>
          <dd className="text-base font-semibold tabular-nums">{formatPercent(weighted("successRate"))}</dd>
        </div>
        <div>
          <dt className="text-xs text-white/80">Avg. qualified</dt>
          <dd className="text-base font-semibold tabular-nums">{formatPercent(weighted("qualifiedRate"))}</dd>
        </div>
      </dl>
    </Card>
  );
}

export function SourcePerformanceGrid({ sources }: { sources: SourcePerformance[] }) {
  const totalRecords = sources.reduce((sum, s) => sum + s.recordsCollected, 0);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sources.map((source) => (
        <SourceCard key={source.id} source={source} totalRecords={totalRecords} />
      ))}
      <SummaryCard sources={sources} totalRecords={totalRecords} />
    </div>
  );
}
