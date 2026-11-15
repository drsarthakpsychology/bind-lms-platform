/**
 * Personal emails to a chosen group (people who filled a form, a filtered
 * pipeline view): merge fields, who gets one, and who goes now or waits for
 * tomorrow's allowance. Pure, so it is tested and runs in the browser preview
 * the same way it runs on the server.
 */

/** The merge fields an admin can type, and what each means. */
export const MERGE_FIELDS = [
  { key: "first_name", label: "First name" },
  { key: "name", label: "Full name" },
  { key: "email", label: "Email" },
] as const;
export type MergeKey = (typeof MERGE_FIELDS)[number]["key"] | "form";

export type PersonalTarget = {
  email: string | null | undefined;
  name: string | null | undefined;
  /** Extra merge values for this send, e.g. { form: "Cohort 2 interest" }. */
  vars?: Record<string, string>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const cleanEmail = (e: string | null | undefined): string | null => {
  const x = String(e ?? "").trim().toLowerCase();
  return EMAIL_RE.test(x) ? x : null;
};

/** "Aanya" from "aanya rao", or from the email when there is no name. */
export function firstName(name: string | null | undefined, email?: string | null): string {
  const n = String(name ?? "").trim().replace(/\s+/g, " ");
  const word = n.split(" ")[0] ?? "";
  const fromEmail = String(email ?? "").split("@")[0]?.split(/[._+\-\d]/)[0] ?? "";
  const pick = word || fromEmail;
  if (!pick) return "there";
  return pick.charAt(0).toLocaleUpperCase("en-IN") + pick.slice(1);
}

/** The values for one person. */
export function mergeVars(t: PersonalTarget): Record<string, string> {
  const email = cleanEmail(t.email) ?? "";
  const name = String(t.name ?? "").trim().replace(/\s+/g, " ");
  return { first_name: firstName(name, email), name: name || firstName(name, email), email, ...(t.vars ?? {}) };
}

/**
 * Replace {first_name}, {name}, {email} (and any extra var given) in the
 * text. Spaces inside the braces and any case are fine: { First_Name }.
 * Unknown fields are left as typed, so the preview shows them.
 */
export function renderMerge(text: string, vars: Record<string, string>): string {
  return String(text ?? "").replace(/\{\s*([a-zA-Z_]+)\s*\}/g, (whole, k: string) => {
    const key = k.toLowerCase();
    return Object.prototype.hasOwnProperty.call(vars, key) ? vars[key] : whole;
  });
}

/** Merge fields in the text that will not be filled (shown as a warning before sending). */
export function unknownFields(text: string, known: string[]): string[] {
  const ok = new Set(known.map((k) => k.toLowerCase()));
  const out = new Set<string>();
  for (const m of String(text ?? "").matchAll(/\{\s*([a-zA-Z_]+)\s*\}/g)) if (!ok.has(m[1].toLowerCase())) out.add(m[1]);
  return [...out];
}

export type PersonalPlan<T extends PersonalTarget> = {
  /** One per email address, in the order given. */
  send: Array<T & { email: string }>;
  queue: Array<T & { email: string }>;
  /** No usable address: nothing is sent to them. */
  noEmail: T[];
  /** The same address picked twice: sent once. */
  duplicates: number;
  /** Emails left today before this batch. */
  remaining: number;
};

/** Who gets an email now, who waits in the queue (over today's allowance), and who has no address. */
export function planPersonal<T extends PersonalTarget>(targets: T[], opts: { limit: number; sentToday: number }): PersonalPlan<T> {
  const remaining = Math.max(0, Math.floor(opts.limit) - Math.max(0, Math.floor(opts.sentToday)));
  const seen = new Set<string>();
  const unique: Array<T & { email: string }> = [];
  const noEmail: T[] = [];
  let duplicates = 0;
  for (const t of targets) {
    const e = cleanEmail(t.email);
    if (!e) {
      noEmail.push(t);
      continue;
    }
    if (seen.has(e)) {
      duplicates++;
      continue;
    }
    seen.add(e);
    unique.push({ ...t, email: e });
  }
  return { send: unique.slice(0, remaining), queue: unique.slice(remaining), noEmail, duplicates, remaining };
}

/** Limits on what an admin can send in one go. */
export const PERSONAL_LIMITS = { subject: 160, body: 8000, recipients: 500 } as const;

export function checkCompose(subject: string, body: string): string | null {
  const s = String(subject ?? "").trim();
  const b = String(body ?? "").trim();
  if (!s) return "Add a subject line.";
  if (s.length > PERSONAL_LIMITS.subject) return "The subject is too long.";
  if (!b) return "Write the email first.";
  if (b.length > PERSONAL_LIMITS.body) return "The email is too long.";
  return null;
}
