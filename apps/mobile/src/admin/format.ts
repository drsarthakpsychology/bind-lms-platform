/**
 * Words and small sums the admin screens share: the website's account and
 * attention labels, "3 h ago", dates in Indian style. Pure, so it is tested.
 */
import type { AdminStudentRow, AttentionFlag } from "./contract";

export type Tone = "ok" | "info" | "warn" | "alert" | "quiet";

/** The website's ACCOUNT_LABEL (src/lib/people/account-status.ts). */
export const ACCOUNT_LABEL: Record<string, string> = {
  locked: "Locked",
  expired: "Access ended",
  active: "Active",
  "set-up": "Password set, not signed in",
  invited: "Invited",
  "link-expired": "Link expired",
  "email-failed": "Login email failed",
  "not-invited": "Not invited yet",
};
export const ACCOUNT_TONE: Record<string, Tone> = {
  locked: "alert",
  expired: "quiet",
  active: "ok",
  "set-up": "warn",
  invited: "info",
  "link-expired": "warn",
  "email-failed": "alert",
  "not-invited": "quiet",
};
/** The website's ACCOUNT_NEXT: what to do next, in plain words. */
export const ACCOUNT_NEXT: Record<string, string | null> = {
  locked: "Unlock when they should get back in.",
  expired: "Extend access if they should continue.",
  active: null,
  "set-up": "They set a password but never came in. Send a nudge.",
  invited: "Waiting for them to set a password.",
  "link-expired": "Send a new login link.",
  "email-failed": "The login email didn't go out. Send it again.",
  "not-invited": "Send their login link.",
};
export const accountLabel = (a: string) => ACCOUNT_LABEL[a] ?? a;
export const accountTone = (a: string): Tone => ACCOUNT_TONE[a] ?? "quiet";

/** The website's FLAG_LABEL (src/lib/people/attention.ts). */
export const FLAG_LABEL: Record<AttentionFlag, string> = {
  login: "Login needs a hand",
  "no-mobile": "No mobile",
  quiet: "Quiet 7+ days",
  "never-seen": "Never came in",
  behind: "Behind on lectures",
  "email-failing": "Emails failing",
  "no-details": "Details form not filled",
};
/** One line under each Needs a look group on Home. */
export const FLAG_DETAIL: Record<AttentionFlag, string> = {
  login: "Their login is stuck. Send a new link.",
  "no-mobile": "No WhatsApp number on file.",
  quiet: "Not on VIBHA for a week or more.",
  "never-seen": "Invited but never came in.",
  behind: "Fewer lectures finished than their cohort.",
  "email-failing": "Emails to them bounce.",
  "no-details": "They have not filled the details form.",
};
export const FLAG_ORDER: AttentionFlag[] = ["login", "email-failing", "never-seen", "behind", "quiet", "no-details", "no-mobile"];

export type Presence = AdminStudentRow["presence"];
export const PRESENCE_LABEL: Record<Presence, string> = { now: "On now", today: "Today", week: "This week", quiet: "Quiet 7+ days", never: "Never" };
export const PRESENCE_TONE: Record<Presence, Tone> = { now: "ok", today: "info", week: "info", quiet: "warn", never: "quiet" };

/** "Just now", "12 min ago", "3 h ago", "4 d ago", then "2 Oct". */
export function ago(iso: string | null | undefined, now = Date.now()): string {
  if (!iso) return "Never";
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "Never";
  const m = Math.round((now - t) / 60000);
  if (m < 2) return "Just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  return d < 31 ? `${d} d ago` : day(iso);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "15 Nov 2026" (or "15 Nov" with short). India time. */
export function day(iso: string | null | undefined, short = false): string {
  if (!iso) return "";
  const t = Date.parse(iso.length === 10 ? `${iso}T00:00:00+05:30` : iso);
  if (Number.isNaN(t)) return "";
  const d = new Date(t + 5.5 * 3600_000);
  const s = `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
  return short ? s : `${s} ${d.getUTCFullYear()}`;
}

/** "16 Nov" this year, "16 Nov 2027" another year (India time). */
export function shortDay(iso: string | null | undefined, now = Date.now()): string {
  const full = day(iso);
  if (!full) return "";
  const year = String(new Date(now + 5.5 * 3600_000).getUTCFullYear());
  return full.endsWith(` ${year}`) ? full.slice(0, -year.length - 1) : full;
}

/** Any yyyy-mm-dd (or full ISO time) inside server text becomes "16 Nov", so no list shows a raw date. */
export function datesIn(text: string, now = Date.now()): string {
  return text.replace(/\b\d{4}-\d{2}-\d{2}(?:T[\d:.]+(?:Z|[+-]\d{2}:?\d{2})?)?\b/g, (m) => shortDay(m, now) || m);
}

export const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** yyyy-mm-dd from a year, a month (0 to 11) and a day. */
export const isoDay = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

/** One month as weeks from Sunday: day numbers, with null for the blanks before the 1st and after the last day. */
export function monthGrid(y: number, m: number): (number | null)[] {
  const first = new Date(Date.UTC(y, m, 1)).getUTCDay();
  const days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const cells: (number | null)[] = [...Array<null>(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  return cells;
}

/** "Sun, 15 Nov", India time (admin Home's date line). */
export function todayLine(now = Date.now()): string {
  try {
    return new Date(now).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: "Asia/Kolkata" });
  } catch {
    return "";
  }
}

/** Today in India as yyyy-mm-dd. */
export function todayIst(now = Date.now()): string {
  return new Date(now + 5.5 * 3600_000).toISOString().slice(0, 10);
}

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

export const pct = (done: number, total: number) => (total > 0 ? Math.round((done / total) * 100) : 0);

/** Minutes as "45 min" or "3 h 20 min". */
export function minutes(m: number): string {
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h} h ${r} min` : `${h} h`;
}

/** A WhatsApp link for an Indian mobile number. */
export function whatsapp(mobile: string): string {
  return `https://wa.me/91${mobile.replace(/\D/g, "").slice(-10)}`;
}

/** Group the Needs a look students by flag, in a fixed order, biggest worries first. */
export function attentionGroups(rows: AdminStudentRow[]): { flag: AttentionFlag; label: string; detail: string; students: AdminStudentRow[] }[] {
  return FLAG_ORDER.map((flag) => ({ flag, label: FLAG_LABEL[flag], detail: FLAG_DETAIL[flag], students: rows.filter((r) => r.flags.includes(flag)) })).filter((g) => g.students.length > 0);
}

export type StudentFilters = { search: string; cohort: string; account: string; presence: "" | Presence; attention: boolean; sort: "name" | "roll" | "active" | "lectures" };
export const NO_FILTERS: StudentFilters = { search: "", cohort: "", account: "", presence: "", attention: false, sort: "name" };

/** The Students list filters, the same rules as the website's table. */
export function filterStudents(rows: AdminStudentRow[], f: StudentFilters): AdminStudentRow[] {
  const needle = f.search.trim().toLowerCase().replace(/\s+/g, " ");
  const list = rows.filter((r) => {
    if (f.cohort === "none" ? r.cohorts.length > 0 : f.cohort && !r.cohorts.some((c) => c.id === f.cohort)) return false;
    if (f.account && r.account !== f.account) return false;
    if (f.presence && r.presence !== f.presence) return false;
    if (f.attention && !r.flags.length) return false;
    if (!needle) return true;
    return `${r.name} ${r.email} ${r.rollNumber ?? ""} ${r.mobileNumber ?? ""}`.toLowerCase().includes(needle);
  });
  const by: Record<StudentFilters["sort"], (a: AdminStudentRow, b: AdminStudentRow) => number> = {
    name: (a, b) => a.name.localeCompare(b.name),
    roll: (a, b) => (a.rollNumber ?? "~").localeCompare(b.rollNumber ?? "~"),
    active: (a, b) => (b.lastSeen ?? "").localeCompare(a.lastSeen ?? ""),
    lectures: (a, b) => b.lecturesDone - a.lecturesDone,
  };
  return [...list].sort(by[f.sort]);
}
export const filterCount = (f: StudentFilters) => [f.cohort, f.account, f.presence, f.attention ? "1" : ""].filter(Boolean).length;

/** The list as CSV, for the share sheet (the website's Download list). */
export function studentsCsv(rows: AdminStudentRow[]): string {
  const head = ["Name", "Roll number", "Email", "Mobile", "Cohorts", "Account", "Last active", "Minutes (7 days)", "Lectures finished", "Lectures available", "Access", "Needs attention"];
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  return [head, ...rows.map((r) => [r.name, r.rollNumber ?? "", r.email, r.mobileNumber ?? "", r.cohorts.map((c) => c.name).join("; "), accountLabel(r.account), r.lastSeen ?? "", r.minutes7, r.lecturesDone, r.lecturesAvailable, r.scope === "full" ? "Full" : "Lectures only", r.flags.map((x) => FLAG_LABEL[x]).join("; ")])]
    .map((line) => line.map(esc).join(","))
    .join("\n");
}

/** The one next step for a student, as on the website's profile. */
export function nextStep(r: AdminStudentRow): { label: string; why: string; action: "unlock" | "login-link" | "message" | "phone" | null } {
  if (r.blocked || r.account === "locked") return { label: "Unlock", why: ACCOUNT_NEXT.locked!, action: "unlock" };
  if (r.account === "link-expired" || r.account === "email-failed" || r.account === "not-invited" || r.flags.includes("login")) return { label: "Send a login link", why: ACCOUNT_NEXT[r.account] ?? "Their login is stuck.", action: "login-link" };
  if (r.account === "set-up" || r.flags.includes("never-seen")) return { label: "Send a nudge", why: "They have not come in yet.", action: "message" };
  if (r.flags.includes("behind") || r.flags.includes("quiet")) return { label: "Check in", why: r.flags.includes("behind") ? "They are behind on lectures." : "Quiet for a week or more.", action: "message" };
  return { label: "Nothing to do", why: "On track.", action: null };
}

/** Which quick view of the pipeline a person falls in (a person can be in more than one). */
export function inPeopleView(p: import("./extra").PersonRow, view: import("./extra").PeopleView, now = Date.now()): boolean {
  const closed = p.stage === "not_interested";
  switch (view) {
    case "all":
      return true;
    case "not_paid":
      return !p.paid && (p.stage === "fee_shared" || p.stage === "joined");
    case "invited":
      return !!p.invitedAt && !p.isStudent;
    case "not_converted":
      return !!p.enquiredAt && !p.invitedAt && !p.isStudent && p.stage !== "joined" && !closed;
    case "quiet": {
      const last = Date.parse(p.lastTouch ?? p.enquiredAt ?? "");
      return !closed && p.stage !== "joined" && (p.stage === "no_reply" || (Number.isFinite(last) && now - last > 14 * 86400_000));
    }
    case "joined":
      return p.stage === "joined" || p.isStudent;
    default:
      return true;
  }
}

/** "Follow up today", "Follow up in 3 d", "Follow up was due 2 d ago". */
export function followUpLine(iso: string | null, now = Date.now()): string | null {
  if (!iso) return null;
  const d = Math.round((Date.parse(iso) - now) / 86400_000);
  if (d === 0) return "Follow up today";
  if (d > 0) return `Follow up in ${d} d`;
  return `Follow up was due ${-d} d ago`;
}
