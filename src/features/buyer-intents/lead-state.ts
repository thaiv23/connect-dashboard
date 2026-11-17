"use client";

import { useCallback, useEffect, useState } from "react";

import type { ContactActivity, ContactActivityType, LeadState, LeadStatus } from "./types";

export const LEAD_STATUSES: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "in_conversation", label: "In conversation" },
  { value: "won", label: "Won" },
  { value: "not_relevant", label: "Not relevant" },
];

export const ACTIVITY_TYPES: { value: ContactActivityType; label: string }[] = [
  { value: "message_sent", label: "Message sent" },
  { value: "reply_received", label: "Reply received" },
  { value: "email_sent", label: "Email sent" },
  { value: "call", label: "Call" },
];

export const EMPTY_LEAD_STATE: LeadState = { saved: false, status: "new", notes: "", activities: [] };

const STORAGE_KEY = "ei.workspace.lead-states.v1";

/**
 * Per-user lead workflow (saved flag, status, notes, contact activity).
 * PROTOTYPE PERSISTENCE: kept in this browser's localStorage. Replace with API calls once the backend
 * exists; the hook's return shape can stay the same.
 */
export function useLeadStates() {
  const [states, setStates] = useState<Record<string, LeadState>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : null;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) setStates(parsed as Record<string, LeadState>);
    } catch {
      /* storage unavailable or corrupted: start empty */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
    } catch {
      /* storage unavailable: state still works for this session */
    }
  }, [states, hydrated]);

  const getState = useCallback((id: string): LeadState => states[id] ?? EMPTY_LEAD_STATE, [states]);

  const update = useCallback((id: string, patch: Partial<LeadState>) => {
    setStates((prev) => ({ ...prev, [id]: { ...EMPTY_LEAD_STATE, ...prev[id], ...patch } }));
  }, []);

  const addActivity = useCallback((id: string, type: ContactActivityType, note: string) => {
    const activity: ContactActivity = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type,
      note: note.trim(),
      recorded_at: new Date().toISOString(),
    };
    setStates((prev) => {
      const current = { ...EMPTY_LEAD_STATE, ...prev[id] };
      return { ...prev, [id]: { ...current, activities: [activity, ...current.activities] } };
    });
  }, []);

  return { getState, update, addActivity };
}
