"use client";

import * as React from "react";
import { Bookmark, BookmarkCheck, ExternalLink, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { formatBudget, formatPublishedFull, LANGUAGE_NAMES, parseSafeUrl } from "../format";
import { ACTIVITY_TYPES, LEAD_STATUSES } from "../lead-state";
import type { BuyerIntent, ContactActivityType, LeadState, LeadStatus } from "../types";
import { BrandLogo } from "./brand-logos";
import { CopyLinkButton } from "./copy-link-button";
import { CountryFlag } from "./country-flag";

interface DrawerProps {
  item: BuyerIntent | null;
  leadState: LeadState;
  onClose: () => void;
  onUpdate: (patch: Partial<LeadState>) => void;
  onAddActivity: (type: ContactActivityType, note: string) => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[130px_1fr] items-start gap-3 text-[13px]">
      <dt className="pt-0.5 text-muted-foreground">{label}</dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  );
}

const None = ({ children }: { children: React.ReactNode }) => <span className="text-muted-foreground">{children}</span>;

function formatRecorded(iso: string) {
  return formatPublishedFull(iso);
}

export function BuyerIntentDetailDrawer({ item, leadState, onClose, onUpdate, onAddActivity }: DrawerProps) {
  const [activityType, setActivityType] = React.useState<ContactActivityType>("message_sent");
  const [activityNote, setActivityNote] = React.useState("");
  const [draftFor, setDraftFor] = React.useState(item?.id);
  if (item?.id !== draftFor) {
    setDraftFor(item?.id);
    setActivityType("message_sent");
    setActivityNote("");
  }

  const url = parseSafeUrl(item?.post_url ?? null);

  return (
    <Sheet open={item !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent>
        {item && (
          <>
            <div className="border-b px-6 py-5 pr-14">
              <SheetTitle className="text-base font-semibold leading-snug tracking-tight">{item.post_title ?? "Buyer request"}</SheetTitle>
              <SheetDescription className="mt-1 text-[13px] text-muted-foreground">
                Published on {item.source_platform}
              </SheetDescription>
            </div>

            <div className="flex-1 space-y-7 overflow-y-auto px-6 py-6">
              <Section title="Original buyer request">
                <p lang={item.original_language ?? undefined} className="whitespace-pre-wrap rounded-lg border bg-muted/40 p-4 text-[14px] leading-relaxed">
                  {item.buyer_intent}
                </p>
                <dl>
                  <Row label="Original language">
                    {item.original_language ? `${LANGUAGE_NAMES[item.original_language] ?? item.original_language} (${item.original_language})` : <None>Unknown</None>}
                  </Row>
                </dl>
              </Section>

              <Section title="Buyer information">
                <dl className="space-y-3">
                  <Row label="Country">
                    {item.country ? (
                      <span className="inline-flex items-center gap-2"><CountryFlag country={item.country} />{item.country}</span>
                    ) : (
                      <None>Unknown</None>
                    )}
                  </Row>
                  <Row label="Laptop brands">
                    {item.laptop_brands.length === 0 ? (
                      <None>Not identified</None>
                    ) : (
                      <ul className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        {item.laptop_brands.map((brand) => (
                          <li key={brand}>
                            <BrandLogo brand={brand} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </Row>
                  <Row label="Models">{item.laptop_models.length ? item.laptop_models.join(", ") : <None>Not identified</None>}</Row>
                  <Row label="Requirements">
                    {item.requirements.length ? (
                      <ul className="list-disc space-y-0.5 pl-4">
                        {item.requirements.map((req) => <li key={req}>{req}</li>)}
                      </ul>
                    ) : (
                      <None>None stated</None>
                    )}
                  </Row>
                  <Row label="Budget">
                    {item.budget === null ? (
                      <None>Not specified</None>
                    ) : (
                      <span className="font-semibold tabular-nums">
                        {formatBudget(item.budget, item.currency)}
                        {item.currency && <span className="ml-1.5 font-normal text-muted-foreground">({item.currency})</span>}
                      </span>
                    )}
                  </Row>
                </dl>
              </Section>

              <Section title="Source information">
                <dl className="space-y-3">
                  <Row label="Platform">{item.source_platform}</Row>
                  <Row label="Published">
                    {item.published_at ? <span className="tabular-nums">{formatPublishedFull(item.published_at)}</span> : <None>Unknown</None>}
                  </Row>
                  <Row label="Post URL">
                    {url ? (
                      <a href={url.href} target="_blank" rel="noopener noreferrer" className="break-all font-medium text-brand-blue underline-offset-2 hover:underline">
                        {url.href}
                      </a>
                    ) : (
                      <None>Unavailable</None>
                    )}
                  </Row>
                </dl>
                {url && (
                  <div className="flex flex-wrap gap-2">
                    <Button asChild>
                      <a href={url.href} target="_blank" rel="noopener noreferrer">
                        <ExternalLink />
                        Open original post
                      </a>
                    </Button>
                    <CopyLinkButton url={url.href} />
                  </div>
                )}
              </Section>

              <Section title="Your actions">
                <p className="text-xs text-muted-foreground">Prototype: your saved leads, status, notes and activity are stored in this browser only.</p>

                <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-end">
                  <Button variant={leadState.saved ? "secondary" : "default"} aria-pressed={leadState.saved} onClick={() => onUpdate({ saved: !leadState.saved })}>
                    {leadState.saved ? <BookmarkCheck /> : <Bookmark />}
                    {leadState.saved ? "Saved lead" : "Save lead"}
                  </Button>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-muted-foreground">Lead status</span>
                    <Select value={leadState.status} onChange={(e) => onUpdate({ status: e.target.value as LeadStatus })}>
                      {LEAD_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </Select>
                  </label>
                </div>

                <label className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-muted-foreground">Personal notes</span>
                  <Textarea value={leadState.notes} onChange={(e) => onUpdate({ notes: e.target.value })} placeholder="Add notes about this lead" />
                </label>

                <div className="space-y-3 rounded-lg border p-4">
                  <p className="text-[13px] font-semibold">Contact activity</p>
                  <div className="grid gap-3 sm:grid-cols-[160px_1fr_auto] sm:items-end">
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-muted-foreground">Type</span>
                      <Select value={activityType} onChange={(e) => setActivityType(e.target.value as ContactActivityType)}>
                        {ACTIVITY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </Select>
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-muted-foreground">Note (optional)</span>
                      <Input value={activityNote} onChange={(e) => setActivityNote(e.target.value)} placeholder="What happened?" />
                    </label>
                    <Button
                      variant="outline"
                      onClick={() => {
                        onAddActivity(activityType, activityNote);
                        setActivityNote("");
                      }}
                    >
                      <Plus />
                      Record
                    </Button>
                  </div>

                  {leadState.activities.length === 0 ? (
                    <p className="text-[13px] text-muted-foreground">No contact activity recorded yet.</p>
                  ) : (
                    <ul className="divide-y">
                      {leadState.activities.map((activity) => (
                        <li key={activity.id} className="py-2 text-[13px]">
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-medium">{ACTIVITY_TYPES.find((t) => t.value === activity.type)?.label}</span>
                            <span className="text-xs text-muted-foreground tabular-nums">{formatRecorded(activity.recorded_at)}</span>
                          </div>
                          {activity.note && <p className="mt-0.5 text-muted-foreground">{activity.note}</p>}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Section>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
