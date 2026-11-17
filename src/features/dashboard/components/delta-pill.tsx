import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

export function DeltaPill({ value, className }: { value: number; className?: string }) {
  const positive = value >= 0;
  const Icon = positive ? ArrowUpRight : ArrowDownRight;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-semibold tabular-nums",
        positive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700",
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      <span className="sr-only">{positive ? "Up" : "Down"}</span>
      {formatPercent(Math.abs(value))}
    </span>
  );
}
