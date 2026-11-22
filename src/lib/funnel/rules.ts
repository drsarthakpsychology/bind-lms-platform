/**
 * Private request-path counts: the shared rules (pure, no server or browser
 * code). See supabase/migrations_pending/2026_11_22_funnel.sql.
 *
 * Nothing personal is ever accepted: no name, email, phone, IP or browser
 * details. A "visit" is a random id made fresh per browser tab session.
 */

export const FUNNEL_EVENTS = ["view", "cta", "form_open", "form_start", "form_sent", "form_failed"] as const;
export type FunnelEvent = (typeof FUNNEL_EVENTS)[number];

/** Pages whose steps are counted. Anything else is dropped. */
export const FUNNEL_PATHS = ["/", "/psychology-internship", "/waitlist", "/free", "/free/help"] as const;
export type FunnelPath = (typeof FUNNEL_PATHS)[number];

export interface FunnelInput {
  visit: string;
  event: FunnelEvent;
  path: FunnelPath;
  detail: string | null;
  refHost: string | null;
}

const VISIT = /^[a-z0-9]{8,32}$/;
const DETAIL = /^[a-z0-9_-]{1,40}$/;
const HOST = /^[a-z0-9.-]{1,80}$/;

/** Turn a referrer into a bare host, or null for our own site, blanks and junk. */
export function refHostOf(raw: unknown): string | null {
  if (typeof raw !== "string" || !raw) return null;
  let host: string;
  try {
    host = new URL(raw).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    host = raw.toLowerCase().replace(/^www\./, "");
  }
  if (!HOST.test(host)) return null;
  if (host === "vibhapsychology.com" || host.endsWith(".vercel.app") || host === "localhost") return null;
  return host;
}

/** Validate one event from the browser. Returns null when anything is off. */
export function parseFunnel(body: unknown): FunnelInput | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const visit = typeof b.visit === "string" ? b.visit : "";
  const event = b.event;
  const path = typeof b.path === "string" ? b.path.replace(/\/+$/, "") || "/" : "";
  const detail = b.detail == null || b.detail === "" ? null : b.detail;
  if (!VISIT.test(visit)) return null;
  if (!(FUNNEL_EVENTS as readonly unknown[]).includes(event)) return null;
  if (!(FUNNEL_PATHS as readonly string[]).includes(path)) return null;
  if (detail !== null && (typeof detail !== "string" || !DETAIL.test(detail))) return null;
  return { visit, event: event as FunnelEvent, path: path as FunnelPath, detail: detail as string | null, refHost: refHostOf(b.ref) };
}

/** Do Not Track or Global Privacy Control, as sent in request headers. */
export function optedOut(headers: { get(name: string): string | null }): boolean {
  return headers.get("dnt") === "1" || headers.get("sec-gpc") === "1";
}

/* ------------------------------------------------------------------ */
/* The admin summary                                                   */
/* ------------------------------------------------------------------ */

export interface SummaryRow {
  event: string;
  path: string;
  detail: string;
  events: number;
  visits: number;
}

/** Plain names for the buttons people press (the `detail` of a cta step). */
export const CTA_LABELS: Record<string, string> = {
  "home-hero": "Homepage, top button",
  "home-nav": "Homepage, menu button",
  "home-quick": "Homepage, quick answers",
  "home-fees": "Homepage, fees section",
  "home-final": "Homepage, last section",
  "home-other": "Homepage, other button",
  "internship-top": "Internship page, top button",
  "internship-end": "Internship page, last section",
  "free-banner": "Free tools, join banner",
  call: "Call button",
  whatsapp: "WhatsApp button",
  login: "Sign in button",
};

export interface FunnelStep {
  key: string;
  label: string;
  visits: number;
  /** Share of the step before, 0 to 100, or null for the first step. */
  keptPct: number | null;
}

export interface FunnelReport {
  steps: FunnelStep[];
  buttons: { key: string; label: string; visits: number }[];
  pages: { path: string; visits: number }[];
  failed: { reason: string; events: number }[];
  biggestDrop: { from: string; to: string; lostPct: number } | null;
}

/** Request or Register buttons (not Call, WhatsApp or Sign in). */
export const REQUEST_BUTTON = (detail: string | null | undefined) =>
  detail !== "call" && detail !== "whatsapp" && detail !== "login";

function sum(rows: SummaryRow[], pick: (r: SummaryRow) => boolean, field: "visits" | "events" = "visits"): number {
  return rows.filter(pick).reduce((n, r) => n + Number(r[field] || 0), 0);
}

/**
 * Build the page's answer from grouped counts. `stepVisits` (distinct visits
 * per step, from the database) is exact; without it the steps fall back to
 * summing groups, which can count a visit that saw two pages twice.
 */
export function buildReport(rows: SummaryRow[], stepVisits?: Partial<Record<string, number>> | null): FunnelReport {
  const pick = (key: string, fallback: number) => {
    const v = stepVisits?.[key];
    return typeof v === "number" && Number.isFinite(v) ? v : fallback;
  };
  const seen = pick("view", sum(rows, (r) => r.event === "view"));
  const pressed = pick("cta", sum(rows, (r) => r.event === "cta" && REQUEST_BUTTON(r.detail)));
  const opened = pick("form_open", sum(rows, (r) => r.event === "form_open"));
  const started = pick("form_start", sum(rows, (r) => r.event === "form_start"));
  const sent = pick("form_sent", sum(rows, (r) => r.event === "form_sent"));
  const raw = [
    { key: "view", label: "Saw a page", visits: seen },
    { key: "cta", label: "Pressed Request or Register", visits: pressed },
    { key: "form_open", label: "Opened the form", visits: opened },
    { key: "form_start", label: "Started typing", visits: started },
    { key: "form_sent", label: "Sent the request", visits: sent },
  ];
  const steps: FunnelStep[] = raw.map((s, i) => {
    const prev = i === 0 ? null : raw[i - 1].visits;
    const keptPct = prev === null ? null : prev > 0 ? Math.min(100, Math.round((s.visits / prev) * 100)) : 0;
    return { ...s, keptPct };
  });
  let biggestDrop: FunnelReport["biggestDrop"] = null;
  for (let i = 1; i < steps.length; i++) {
    const prev = steps[i - 1];
    if (prev.visits < 5) continue;
    const lost = 100 - (steps[i].keptPct ?? 0);
    if (!biggestDrop || lost > biggestDrop.lostPct) biggestDrop = { from: prev.label, to: steps[i].label, lostPct: lost };
  }
  const btn = new Map<string, number>();
  for (const r of rows) if (r.event === "cta") btn.set(r.detail || "home-other", (btn.get(r.detail || "home-other") ?? 0) + Number(r.visits || 0));
  const buttons = [...btn.entries()]
    .map(([key, visits]) => ({ key, label: CTA_LABELS[key] ?? key, visits }))
    .sort((a, b) => b.visits - a.visits);
  const pg = new Map<string, number>();
  for (const r of rows) if (r.event === "view") pg.set(r.path, (pg.get(r.path) ?? 0) + Number(r.visits || 0));
  const pages = [...pg.entries()].map(([path, visits]) => ({ path, visits })).sort((a, b) => b.visits - a.visits);
  const fl = new Map<string, number>();
  for (const r of rows) if (r.event === "form_failed") fl.set(r.detail || "other", (fl.get(r.detail || "other") ?? 0) + Number(r.events || 0));
  const failed = [...fl.entries()].map(([reason, events]) => ({ reason, events })).sort((a, b) => b.events - a.events);
  return { steps, buttons, pages, failed, biggestDrop };
}
