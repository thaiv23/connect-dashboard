/** Tiny dependency-free trend line used inside KPI cards. Inherits color from `currentColor`. */
export function Sparkline({ values, className }: { values: number[]; className?: string }) {
  if (values.length < 2) return null;

  const width = 96;
  const height = 36;
  const pad = 3;
  const min = Math.min(...values);
  const span = Math.max(...values) - min || 1;

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = pad + (1 - (v - min) / span) * (height - pad * 2);
    return `${x.toFixed(1)} ${y.toFixed(1)}`;
  });
  const line = `M${points.join(" L")}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className={className} fill="none" aria-hidden>
      <path d={`${line} L${width} ${height} L0 ${height} Z`} fill="currentColor" opacity={0.1} />
      <path d={line} stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
