"use client";

import * as React from "react";
import { Globe, Menu } from "lucide-react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { NavGroup } from "@/config/navigation";
import { Sidebar } from "./sidebar";

/** Below this width (tablets) the sidebar starts collapsed to give the content more room. */
const COLLAPSE_BELOW_PX = 1100;

interface AppShellProps {
  children: React.ReactNode;
  /** Sidebar menu. Defaults to the Admin menu. */
  navigation?: NavGroup[];
}

export function AppShell({ children, navigation }: AppShellProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const query = window.matchMedia(`(max-width: ${COLLAPSE_BELOW_PX - 1}px)`);
    setCollapsed(query.matches);
    const onChange = (event: MediaQueryListEvent) => setCollapsed(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  React.useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <TooltipProvider delayDuration={0}>
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapsed={() => setCollapsed((value) => !value)}
        onNavigate={() => setMobileOpen(false)}
        navigation={navigation}
      />
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-sidebar/60 md:hidden" onClick={() => setMobileOpen(false)} aria-hidden />
      )}

      <div className={cn("flex min-h-screen flex-col transition-[padding] duration-200 ease-out", collapsed ? "md:pl-[72px]" : "md:pl-[272px]")}>
        <div className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-card px-4 md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
            className="grid size-9 place-items-center rounded-md text-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            <Menu className="size-5" />
          </button>
          <span className="grid size-7 place-items-center rounded-md bg-brand-gradient text-white">
            <Globe className="size-4" aria-hidden />
          </span>
          <span className="text-[13px] font-semibold tracking-wide">EUROPE INTELLIGENCE</span>
        </div>
        <main className="flex-1">{children}</main>
      </div>
    </TooltipProvider>
  );
}
