import { Info } from "lucide-react";

export function SimulationNotice() {
  return (
    <div
      role="note"
      className="flex items-start gap-3 rounded-lg border border-brand-accent/25 bg-brand-accent/[0.06] px-4 py-3 text-[13px] leading-relaxed text-brand-navy"
    >
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
      <p>
        <span className="font-semibold">This page shows simulated data.</span> Every figure, chart and activity is
        illustrative. No searches, collection jobs or automations are running, and no external sources or databases are
        connected.
      </p>
    </div>
  );
}
