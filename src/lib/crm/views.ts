import type { Person, StageId } from "./people";

/**
 * Pipeline quick views and filters. Pure, so the counts on the screen and the
 * tests agree. "Now" is passed in, so render code stays pure too.
 */

export const QUICK_VIEWS = [
  { id: "all", label: "Everyone" },
  { id: "not_paid", label: "Not paid yet" },
  { id: "invited", label: "Invited, not joined" },
  { id: "not_converted", label: "Enquired, not converted" },
  { id: "quiet", label: "Went quiet" },
  { id: "joined", label: "Joined" },
] as const;
export type QuickView = (typeof QUICK_VIEWS)[number]["id"];
export const isQuickView = (v: string | null | undefined): v is QuickView => QUICK_VIEWS.some((x) => x.id === v);

export const QUIET_DAYS = [7, 14, 30] as const;
export const DAY = 86400000;

export type LastContact = "" | "week" | "month" | "older" | "never";
export const LAST_CONTACT_LABEL: Record<Exclude<LastContact, "">, string> = {
  week: "In the last 7 days",
  month: "In the last 30 days",
  older: "Over 30 days ago",
  never: "Never contacted",
};

export type PipelineFilters = {
  view?: QuickView;
  /** "Went quiet" means no contact in this many days. */
  quietDays?: number;
  q?: string;
  stage?: StageId | "";
  cohortId?: string;
  source?: string;
  /** Enquired (or added) on or after / before these days, YYYY-MM-DD in India time. */
  from?: string;
  to?: string;
  lastContact?: LastContact;
};

const ms = (iso: string | null | undefined) => (iso ? new Date(iso).getTime() : NaN);

/** Has an account and has set it up (or signed in): they are in. */
export const hasJoined = (p: Person) => p.isStudent && (p.setupDone || p.signedIn);

/** The day this person first appeared: the enquiry, else the invite. */
export const firstSeen = (p: Person) => p.enquiredAt ?? p.inviteSentAt ?? null;

/** Where they came from, in words ("website", "Added as a student"). */
export const sourceOf = (p: Person) => (p.source && p.source.trim()) || (p.isEnquiry ? "website" : p.isStudent ? "Added as a student" : "Not set");

export function inView(p: Person, view: QuickView, now: number, quietDays = 14): boolean {
  switch (view) {
    case "all":
      return true;
    case "not_paid":
      // Expected to pay: the fee was shared, an invite went out, or they joined. Not yet marked paid.
      return !p.paidAt && p.stage !== "not_interested" && (p.stage === "fee_shared" || p.stage === "joined" || p.isStudent || Boolean(p.inviteSentAt));
    case "invited":
      return Boolean(p.inviteSentAt || p.isStudent) && !hasJoined(p);
    case "not_converted":
      return p.isEnquiry && !p.isStudent && p.stage !== "joined" && p.stage !== "not_interested";
    case "quiet": {
      if (p.stage === "not_interested") return false;
      if (hasJoined(p) && p.paidAt) return false;
      const last = ms(p.lastContactAt);
      if (Number.isNaN(last)) {
        // Never contacted: quiet once they have been with us that long.
        const since = ms(firstSeen(p));
        return Number.isNaN(since) || now - since >= quietDays * DAY;
      }
      return now - last >= quietDays * DAY;
    }
    case "joined":
      return p.stage === "joined" || hasJoined(p);
  }
}

/** India-time day of an instant, YYYY-MM-DD. */
export const istDay = (iso: string) => new Date(new Date(iso).getTime() + 5.5 * 3600000).toISOString().slice(0, 10);

export function lastContactBucket(p: Person, now: number): Exclude<LastContact, ""> {
  const last = ms(p.lastContactAt);
  if (Number.isNaN(last)) return "never";
  const age = now - last;
  if (age <= 7 * DAY) return "week";
  if (age <= 30 * DAY) return "month";
  return "older";
}

/** Everything except the quick view (so the view counts follow the other filters). */
export function matchesFilters(p: Person, f: PipelineFilters, now: number): boolean {
  const q = (f.q ?? "").trim().toLowerCase();
  if (q && !`${p.name} ${p.email} ${p.phone ?? ""} ${p.college ?? ""}`.toLowerCase().includes(q)) return false;
  if (f.stage && p.stage !== f.stage) return false;
  if (f.cohortId && !p.cohorts.some((c) => c.id === f.cohortId)) return false;
  if (f.source && sourceOf(p) !== f.source) return false;
  if (f.from || f.to) {
    const at = firstSeen(p);
    if (!at) return false;
    const d = istDay(at);
    if (f.from && d < f.from) return false;
    if (f.to && d > f.to) return false;
  }
  if (f.lastContact && lastContactBucket(p, now) !== f.lastContact) return false;
  return true;
}

export function filterPipeline(people: Person[], f: PipelineFilters, now: number): Person[] {
  const view = f.view ?? "all";
  return people.filter((p) => matchesFilters(p, f, now) && inView(p, view, now, f.quietDays));
}

/** How many people each quick view holds under the other filters. */
export function viewCounts(people: Person[], f: PipelineFilters, now: number): Record<QuickView, number> {
  const base = people.filter((p) => matchesFilters(p, f, now));
  return Object.fromEntries(QUICK_VIEWS.map((v) => [v.id, base.filter((p) => inView(p, v.id, now, f.quietDays)).length])) as Record<QuickView, number>;
}

/** The sources that appear, for the Source filter. */
export function sourcesOf(people: Person[]): string[] {
  return [...new Set(people.map(sourceOf))].sort((a, b) => a.localeCompare(b));
}

/** A wa.me link for an Indian or international number; null when the number is unusable. */
export function waNumber(phone: string | null | undefined): string | null {
  const d = String(phone ?? "").replace(/\D/g, "").replace(/^0+/, "");
  if (d.length === 10) return `91${d}`;
  if (d.length >= 11 && d.length <= 15) return d;
  return null;
}

export function waLink(phone: string | null | undefined, text?: string): string | null {
  const n = waNumber(phone);
  if (!n) return null;
  return `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

/** What to say on WhatsApp, with {first_name} filled in for each person. */
export function waMessage(template: string, p: Pick<Person, "name" | "email">): string {
  const first = (p.name.trim().split(/\s+/)[0] || p.email.split("@")[0] || "there").replace(/^./, (c) => c.toUpperCase());
  return template.replace(/\{\s*first_name\s*\}/gi, first).replace(/\{\s*name\s*\}/gi, p.name.trim() || first);
}
