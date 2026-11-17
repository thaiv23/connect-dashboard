"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for contexts where the async clipboard API is blocked (for example some iframes).
    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(area);
      return ok;
    } catch {
      return false;
    }
  }
}

function useCopy(url: string) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const copy = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (await copyText(url)) {
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    }
  };
  return { copied, copy };
}

/** Compact icon button used inside table rows. */
export function CopyLinkIconButton({ url }: { url: string }) {
  const { copied, copy } = useCopy(url);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" className="size-7 text-muted-foreground" onClick={copy} aria-label={copied ? "Link copied" : "Copy post link"}>
          {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">{copied ? "Copied" : "Copy link"}</TooltipContent>
    </Tooltip>
  );
}

/** Labelled button used in the detail drawer. */
export function CopyLinkButton({ url }: { url: string }) {
  const { copied, copy } = useCopy(url);
  return (
    <Button variant="outline" onClick={copy}>
      {copied ? <Check className="text-emerald-600" /> : <Copy />}
      {copied ? "Link copied" : "Copy link"}
    </Button>
  );
}
