import { buildMockBuyerIntents } from "./mock-data";
import type { BuyerIntentListResponse } from "./types";

/**
 * Data access for the Buyer Intent Feed.
 *
 * No Buyer Intent endpoint or table exists yet, so this resolves simulated records. When the backend is
 * ready, replace the body with a request (keeping the signature and respecting the existing auth):
 *
 *   const res = await fetch("/api/v1/buyer-intents", { cache: "no-store" });
 *   if (!res.ok) throw new Error("Failed to load buyer intents");
 *   return (await res.json()) as BuyerIntentListResponse;   // dataStatus: "live"
 *
 * Filtering, sorting and paging live in `query.ts` and can move server-side with the same parameters.
 */
export async function listBuyerIntents(): Promise<BuyerIntentListResponse> {
  return { items: buildMockBuyerIntents(), dataStatus: "demo" };
}
