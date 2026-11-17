"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

import { NAVIGATION, type NavGroup, type NavItem } from "@/config/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { cn } from "@/lib/utils";

/** Hide an element on md+ screens when the sidebar is collapsed (the mobile drawer is always expanded). */
const hideWhenCollapsed = "md:group-data-[collapsed=true]/sidebar:hidden";

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapsed: () => void;
  onNavigate: () => void;
  /** Menu to render. Defaults to the Admin menu. */
  navigation?: NavGroup[];
}

function SidebarItem({
  item,
  active,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onNavigate: () => void;
}) {
  const Icon = item.icon;
  const enabled = Boolean(item.href);

  const itemClass = cn(
    "relative flex h-9 items-center gap-3 rounded-md px-3 text-[13px] font-medium outline-none transition-colors",
    "focus-visible:ring-2 focus-visible:ring-brand-accent/70",
    "md:group-data-[collapsed=true]/sidebar:justify-center md:group-data-[collapsed=true]/sidebar:px-0",
    enabled
      ? active
        ? "bg-sidebar-accent text-white before:absolute before:inset-y-1.5 before:left-0 before:w-[3px] before:rounded-full before:bg-brand-accent"
        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"
      : "cursor-not-allowed text-sidebar-foreground/45",
  );

  const content = (
    <>
      <Icon className="size-[18px] shrink-0" aria-hidden />
      <span className={cn("truncate", hideWhenCollapsed)}>{item.label}</span>
    </>
  );

  const tip = collapsed || !enabled ? item.label : null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {enabled ? (
          <Link href={item.href!} className={itemClass} aria-current={active ? "page" : undefined} onClick={onNavigate}>
            {content}
          </Link>
        ) : (
          <div className={itemClass} aria-disabled="true">
            {content}
          </div>
        )}
      </TooltipTrigger>
      {tip && <TooltipContent side="right">{tip}</TooltipContent>}
    </Tooltip>
  );
}

export function Sidebar({ collapsed, mobileOpen, onToggleCollapsed, onNavigate, navigation = NAVIGATION }: SidebarProps) {
  const pathname = usePathname();
  const ToggleIcon = collapsed ? ChevronsRight : ChevronsLeft;

  return (
    <aside
      aria-label="Primary"
      data-collapsed={collapsed}
      className={cn(
        "group/sidebar fixed inset-y-0 left-0 z-40 flex w-[272px] flex-col bg-sidebar text-sidebar-foreground",
        "transition-[width,transform] duration-200 ease-out md:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full",
        collapsed ? "md:w-[72px]" : "md:w-[272px]",
      )}
    >
      <nav className="flex-1 overflow-y-auto px-3 pb-4 pt-3 [scrollbar-color:rgb(255_255_255/0.15)_transparent] [scrollbar-width:thin]">
        {navigation.map((group) => (
          <div key={group.label || group.items[0]?.label}>
            {group.label ? (
              <p className={cn("px-3 pb-1.5 pt-5 text-[11px] font-semibold tracking-[0.08em] text-sidebar-muted", hideWhenCollapsed)}>
                {group.number && <span className="mr-1.5 tabular-nums text-brand-accent/80">{group.number}.</span>}
                {group.label}
              </p>
            ) : (
              <div className={cn("pt-5", hideWhenCollapsed)} />
            )}
            <div className="mx-3 my-3 hidden h-px bg-sidebar-border md:group-data-[collapsed=true]/sidebar:block" />
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.label}>
                  <SidebarItem
                    item={item}
                    collapsed={collapsed}
                    active={Boolean(item.href) && pathname === item.href}
                    onNavigate={onNavigate}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 space-y-0.5 border-t border-sidebar-border p-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <LogoutButton
              className="flex h-9 w-full items-center gap-3 rounded-md px-3 text-[13px] font-medium text-sidebar-foreground/80 outline-none transition-colors hover:bg-sidebar-accent hover:text-white focus-visible:ring-2 focus-visible:ring-brand-accent/70 disabled:opacity-60 md:group-data-[collapsed=true]/sidebar:justify-center md:group-data-[collapsed=true]/sidebar:px-0"
              labelClassName={hideWhenCollapsed}
            />
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">Log out</TooltipContent>}
        </Tooltip>
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          className="hidden h-9 w-full items-center gap-3 rounded-md px-3 text-[13px] font-medium text-sidebar-foreground/80 outline-none transition-colors hover:bg-sidebar-accent hover:text-white focus-visible:ring-2 focus-visible:ring-brand-accent/70 md:flex md:group-data-[collapsed=true]/sidebar:justify-center md:group-data-[collapsed=true]/sidebar:px-0"
        >
          <ToggleIcon className="size-[18px] shrink-0" aria-hidden />
          <span className={hideWhenCollapsed}>Collapse sidebar</span>
        </button>
      </div>
    </aside>
  );
}
