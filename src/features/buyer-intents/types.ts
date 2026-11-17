import type { DataStatus } from "@/features/dashboard/types";

/** Source platforms where buyer requests are published. Never a laptop brand. */
export type SourcePlatform =
  | "Reddit"
  | "Facebook Groups"
  | "Local Forums"
  | "Technology Communities"
  | "Classified Communities";

/**
 * One collected buyer request. Field names match the agreed data structure (snake_case) so a backend
 * response can be used as-is. Original content, timestamps and URLs are never rewritten.
 */
export interface BuyerIntent {
  id: string;
  /** Original post title, when the platform has one. */
  post_title: string | null;
  /** Original buyer request content, in its original language. */
  buyer_intent: string;
  /** ISO 639-1 code of the original language. */
  original_language: string | null;
  /** `null` when there is not enough evidence to name a country. */
  country: string | null;
  /** Laptop manufacturers identified in the post. Empty when none could be identified. */
  laptop_brands: string[];
  /** Models identified in the post, if any. */
  laptop_models: string[];
  /** Requirements or configurations the buyer explicitly stated. */
  requirements: string[];
  /** Explicitly stated amount. `null` when the buyer gave no budget. */
  budget: number | null;
  /** Currency of the stated budget (ISO 4217), kept separate from the amount. */
  currency: string | null;
  source_platform: SourcePlatform;
  /** Original publication time (ISO-8601, UTC). `null` when unavailable. Not the collection time. */
  published_at: string | null;
  /** Direct URL of the original post. `null` when unavailable. */
  post_url: string | null;
}

export interface BuyerIntentListResponse {
  items: BuyerIntent[];
  dataStatus: DataStatus;
}

/* ---------- Per-user lead workflow (separate from the collected record) ---------- */

export type LeadStatus = "new" | "contacted" | "in_conversation" | "won" | "not_relevant";
export type ContactActivityType = "message_sent" | "reply_received" | "email_sent" | "call";

export interface ContactActivity {
  id: string;
  type: ContactActivityType;
  note: string;
  /** ISO-8601, UTC. The moment the user recorded it. */
  recorded_at: string;
}

export interface LeadState {
  saved: boolean;
  status: LeadStatus;
  notes: string;
  activities: ContactActivity[];
}
