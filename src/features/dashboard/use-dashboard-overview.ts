"use client";

import { useCallback, useRef, useState } from "react";

import { getDashboardOverview } from "./api";
import type { DashboardOverviewData, DateRangeKey } from "./types";

/** Holds the selected range and the data for it. The first payload comes from the server page. */
export function useDashboardOverview(initialData: DashboardOverviewData) {
  const [data, setData] = useState(initialData);
  const [range, setRangeState] = useState<DateRangeKey>(initialData.range);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const latestRequest = useRef(0);

  const setRange = useCallback(async (next: DateRangeKey) => {
    const requestId = ++latestRequest.current;
    setRangeState(next);
    setIsLoading(true);
    setError(null);
    try {
      const result = await getDashboardOverview(next);
      if (requestId === latestRequest.current) setData(result);
    } catch {
      if (requestId === latestRequest.current) setError("Could not load data for this date range. Try again.");
    } finally {
      if (requestId === latestRequest.current) setIsLoading(false);
    }
  }, []);

  return { data, range, setRange, isLoading, error };
}
