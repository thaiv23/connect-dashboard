"use client";

import { CalendarDays, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DATE_RANGES } from "../constants";
import type { DateRangeKey } from "../types";

interface DateRangeSelectorProps {
  value: DateRangeKey;
  onChange: (value: DateRangeKey) => void;
}

export function DateRangeSelector({ value, onChange }: DateRangeSelectorProps) {
  const current = DATE_RANGES.find((range) => range.key === value) ?? DATE_RANGES[1];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-9 gap-2 pl-3 pr-2.5" aria-label={`Date range: ${current.label}`}>
          <CalendarDays className="size-4 text-muted-foreground" aria-hidden />
          <span>{current.label}</span>
          <span className="hidden text-muted-foreground xl:inline">({current.description})</span>
          <ChevronDown className="size-4 text-muted-foreground" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Date range</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={value} onValueChange={(next) => onChange(next as DateRangeKey)}>
          {DATE_RANGES.map((range) => (
            <DropdownMenuRadioItem key={range.key} value={range.key}>
              <span className="flex flex-col">
                <span className="font-medium">{range.label}</span>
                <span className="text-xs text-muted-foreground">{range.description}</span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>Custom range (coming soon)</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
