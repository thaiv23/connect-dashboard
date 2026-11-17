/** Small local flags for the target countries. Unknown countries render no flag (the name is always shown). */
const FLAGS: Record<string, React.ReactNode> = {
  Germany: (
    <>
      <rect width="30" height="7" fill="#000000" />
      <rect y="6.67" width="30" height="6.67" fill="#DD0000" />
      <rect y="13.33" width="30" height="6.67" fill="#FFCE00" />
    </>
  ),
  France: (
    <>
      <rect width="10" height="20" fill="#0055A4" />
      <rect x="10" width="10" height="20" fill="#FFFFFF" />
      <rect x="20" width="10" height="20" fill="#EF4135" />
    </>
  ),
  Italy: (
    <>
      <rect width="10" height="20" fill="#009246" />
      <rect x="10" width="10" height="20" fill="#FFFFFF" />
      <rect x="20" width="10" height="20" fill="#CE2B37" />
    </>
  ),
  Spain: (
    <>
      <rect width="30" height="20" fill="#AA151B" />
      <rect y="5" width="30" height="10" fill="#F1BF00" />
    </>
  ),
  Finland: (
    <>
      <rect width="30" height="20" fill="#FFFFFF" />
      <rect x="8" width="5" height="20" fill="#003580" />
      <rect y="7.5" width="30" height="5" fill="#003580" />
    </>
  ),
  Denmark: (
    <>
      <rect width="30" height="20" fill="#C8102E" />
      <rect x="9" width="4" height="20" fill="#FFFFFF" />
      <rect y="8" width="30" height="4" fill="#FFFFFF" />
    </>
  ),
};

export function CountryFlag({ country }: { country: string | null }) {
  const flag = country ? FLAGS[country] : null;
  if (!flag) return null;

  return (
    <svg viewBox="0 0 30 20" className="h-3.5 w-5 shrink-0 rounded-[2px] ring-1 ring-black/10" aria-hidden>
      {flag}
    </svg>
  );
}
