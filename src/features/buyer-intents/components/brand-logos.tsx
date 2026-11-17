import { Laptop } from "lucide-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { findBrandLogo, logoParts } from "../brand-logos";

/** Logos share one height (spec: roughly 28 to 36 px); wordmarks keep their proportions up to a max width. */
const LOGO_HEIGHT = 30;
const LOGO_MAX_WIDTH = 64;

function logoSize(viewBox: string) {
  const [, , w, h] = viewBox.split(" ").map(Number);
  const width = Math.min(LOGO_MAX_WIDTH, (LOGO_HEIGHT * w) / h);
  return { width: Math.round(width), height: Math.round((width * h) / w) };
}

/** Laptop MANUFACTURER logo. Never used for the publishing platform. */
export function BrandLogo({ brand }: { brand: string }) {
  const logo = findBrandLogo(brand);

  if (!logo) {
    // No approved asset for this brand: neutral tile with the brand name instead of an invented logo.
    return (
      <span className="inline-flex h-9 items-center gap-1.5 rounded-md border bg-muted px-2 text-xs font-medium text-muted-foreground">
        <Laptop className="size-4 shrink-0" aria-hidden />
        {brand}
      </span>
    );
  }

  const { width, height } = logoSize(logo.viewBox);

  return (
    <Tooltip>
      <TooltipTrigger
        asChild
        onFocus={(event) => {
          // Sheet auto-focuses the first tab stop. That is not keyboard focus, so keep the name hidden until hover or Tab.
          if (!event.currentTarget.matches(":focus-visible")) event.preventDefault();
        }}
      >
        <span tabIndex={0} className="inline-grid h-9 shrink-0 place-items-center rounded-md px-0.5 outline-none focus-visible:ring-2 focus-visible:ring-ring/60">
          <svg viewBox={logo.viewBox} width={width} height={height} role="img" aria-label={`${logo.name} logo`}>
            {logoParts(logo).map((part) => (
              <path key={part.path} d={part.path} fill={part.color} />
            ))}
          </svg>
        </span>
      </TooltipTrigger>
      <TooltipContent side="top">{logo.name}</TooltipContent>
    </Tooltip>
  );
}

export function BrandLogoList({ brands, max = 3 }: { brands: string[]; max?: number }) {
  if (brands.length === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground">
        <Laptop className="size-4" aria-hidden />
        Unknown
      </span>
    );
  }

  const visible = brands.slice(0, max);
  const hidden = brands.slice(max);

  return (
    <div className="flex items-center gap-2">
      {visible.map((brand) => (
        <BrandLogo key={brand} brand={brand} />
      ))}
      {hidden.length > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span tabIndex={0} className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/60">
              +{hidden.length}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top">{hidden.join(", ")}</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
