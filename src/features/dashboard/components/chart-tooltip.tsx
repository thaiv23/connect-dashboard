import { formatNumber } from "@/lib/format";

interface TooltipEntry {
  name?: string | number;
  value?: number | string | ReadonlyArray<number | string>;
  color?: string;
  payload?: { fill?: string };
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<TooltipEntry>;
  label?: string | number;
}

/** Shared Recharts tooltip. Pass as `<Tooltip content={<ChartTooltip />} />`. */
export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="min-w-40 rounded-lg border bg-popover px-3 py-2 text-xs shadow-lg">
      {label !== undefined && label !== "" && <p className="mb-1.5 font-semibold text-foreground">{label}</p>}
      <ul className="space-y-1">
        {payload.map((entry, i) => (
          <li key={`${entry.name}-${i}`} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="size-2 rounded-[2px]" style={{ background: entry.color ?? entry.payload?.fill }} aria-hidden />
              {entry.name}
            </span>
            <span className="font-semibold tabular-nums text-foreground">
              {typeof entry.value === "number" ? formatNumber(entry.value) : String(entry.value ?? "")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
