"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, Bookmark, ChevronLeft, ChevronRight, ChevronsUpDown, ExternalLink, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatBudget, formatPublishedDate, formatPublishedTime, parseSafeUrl } from "../format";
import { PAGE_SIZES, type SortKey } from "../query";
import type { BuyerIntent } from "../types";
import { BrandLogoList } from "./brand-logos";
import { CopyLinkIconButton } from "./copy-link-button";
import { CountryFlag } from "./country-flag";

const TRUNCATION_TOOLTIP_MIN_CHARS = 120;

function SortableHead({ label, state, onClick, className }: { label: string; state: "asc" | "desc" | null; onClick: () => void; className?: string }) {
  const Icon = state === "asc" ? ArrowUp : state === "desc" ? ArrowDown : ChevronsUpDown;
  return (
    <TableHead className={className} aria-sort={state === "asc" ? "ascending" : state === "desc" ? "descending" : "none"}>
      <button
        type="button"
        onClick={onClick}
        className="-ml-1.5 inline-flex items-center gap-1 rounded px-1.5 py-1 font-medium outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60"
      >
        {label}
        <Icon className={cn("size-3.5", state ? "text-brand-blue" : "text-muted-foreground")} aria-hidden />
      </button>
    </TableHead>
  );
}

function PostLink({ postUrl }: { postUrl: string | null }) {
  const url = parseSafeUrl(postUrl);
  if (!url) return <span className="text-[13px] text-muted-foreground">Unavailable</span>;

  const display = `${url.hostname.replace(/^www\./, "")}${url.pathname === "/" ? "" : url.pathname}`;
  return (
    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={url.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex max-w-[190px] items-center gap-1.5 rounded text-[13px] font-medium text-brand-blue underline-offset-2 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            <span className="truncate">{display}</span>
            <ExternalLink className="size-3.5 shrink-0" aria-hidden />
            <span className="sr-only">(opens the original post in a new tab)</span>
          </a>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-sm break-all">{url.href}</TooltipContent>
      </Tooltip>
      <CopyLinkIconButton url={url.href} />
    </div>
  );
}

function IntentCell({ item, saved, onOpen }: { item: BuyerIntent; saved: boolean; onOpen: () => void }) {
  const text = item.post_title ?? item.buyer_intent;
  const button = (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onOpen(); }}
      className="flex w-full items-start gap-2 rounded text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
      aria-label={`Open details: ${text}`}
    >
      <span lang={item.original_language ?? undefined} className="line-clamp-2 text-[14px] font-medium leading-snug text-foreground">
        {text}
      </span>
      {saved && <Bookmark className="mt-0.5 size-3.5 shrink-0 fill-brand-blue text-brand-blue" aria-label="Saved lead" />}
    </button>
  );

  if (text.length < TRUNCATION_TOOLTIP_MIN_CHARS) return button;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="top" align="start" className="max-w-md whitespace-pre-wrap">{text}</TooltipContent>
    </Tooltip>
  );
}

interface TableProps {
  items: BuyerIntent[];
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
  onOpen: (id: string) => void;
  selectedId: string | null;
  savedIds: Set<string>;
  onClearFilters: () => void;
  hasFilters: boolean;
  pagination: { page: number; totalPages: number; start: number; end: number; total: number };
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function BuyerIntentTable({
  items, sort, onSortChange, onOpen, selectedId, savedIds, onClearFilters, hasFilters, pagination, pageSize, onPageChange, onPageSizeChange,
}: TableProps) {
  const publishedState = sort === "newest" ? "desc" : sort === "oldest" ? "asc" : null;
  const budgetState = sort === "budget_asc" ? "asc" : sort === "budget_desc" ? "desc" : null;

  return (
    <Card className="overflow-hidden">
      <Table className="min-w-[1200px]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="min-w-[340px] pl-5">Buyer Intent</TableHead>
            <TableHead className="w-[130px]">Country</TableHead>
            <TableHead className="w-[220px]">Logo</TableHead>
            <SortableHead label="Budget" className="w-[120px]" state={budgetState} onClick={() => onSortChange(sort === "budget_asc" ? "budget_desc" : "budget_asc")} />
            <TableHead className="w-[150px]">Source</TableHead>
            <SortableHead label="Published" className="w-[140px]" state={publishedState} onClick={() => onSortChange(sort === "newest" ? "oldest" : "newest")} />
            <TableHead className="w-[250px] pr-5">Post URL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={7} className="py-16 text-center">
                <SearchX className="mx-auto size-8 text-muted-foreground" aria-hidden />
                <p className="mt-3 text-sm font-medium">No buyer requests match your search</p>
                <p className="mt-1 text-[13px] text-muted-foreground">Try a different keyword or remove some filters.</p>
                {hasFilters && (
                  <Button variant="outline" size="sm" className="mt-4" onClick={onClearFilters}>Clear all filters</Button>
                )}
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow
                key={item.id}
                onClick={() => onOpen(item.id)}
                data-selected={selectedId === item.id}
                className="cursor-pointer data-[selected=true]:bg-accent/60"
              >
                <TableCell className="max-w-[560px] pl-5">
                  <IntentCell item={item} saved={savedIds.has(item.id)} onOpen={() => onOpen(item.id)} />
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {item.country ? (
                    <span className="inline-flex items-center gap-2 text-[13px]">
                      <CountryFlag country={item.country} />
                      {item.country}
                    </span>
                  ) : (
                    <span className="text-[13px] text-muted-foreground">Unknown</span>
                  )}
                </TableCell>
                <TableCell><BrandLogoList brands={item.laptop_brands} /></TableCell>
                <TableCell className="whitespace-nowrap text-[13px] tabular-nums">
                  {item.budget === null ? (
                    <span className="text-muted-foreground">Not specified</span>
                  ) : (
                    <span className="font-semibold">{formatBudget(item.budget, item.currency)}</span>
                  )}
                </TableCell>
                <TableCell className="whitespace-nowrap text-[13px]">{item.source_platform}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {item.published_at ? (
                    <>
                      <p className="text-[13px] tabular-nums">{formatPublishedDate(item.published_at)}</p>
                      <p className="text-xs text-muted-foreground tabular-nums">{formatPublishedTime(item.published_at)}</p>
                    </>
                  ) : (
                    <span className="text-[13px] text-muted-foreground">Unknown</span>
                  )}
                </TableCell>
                <TableCell className="pr-5"><PostLink postUrl={item.post_url} /></TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-3">
        <p className="text-[13px] text-muted-foreground tabular-nums">
          {pagination.total === 0 ? "No results" : `Showing ${pagination.start + 1} to ${pagination.end} of ${pagination.total}`}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-[13px] text-muted-foreground">
            Rows per page
            <Select className="h-8 w-[72px]" value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}>
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </Select>
          </label>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onPageChange(pagination.page - 1)} disabled={pagination.page <= 1} aria-label="Previous page">
              <ChevronLeft />
            </Button>
            <span className="min-w-20 text-center text-[13px] tabular-nums">Page {pagination.page} of {pagination.totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => onPageChange(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages} aria-label="Next page">
              <ChevronRight />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
