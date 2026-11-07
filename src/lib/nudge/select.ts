/**
 * "Email students who've gone quiet", who goes on the list, and who starts
 * ticked. Pure (no server imports), so it is unit-tested and shared by the
 * Progress page and the bulk-send route.
 *
 * Ticked = never started, or nothing on VIBHA for `days` or more days.
 * Blocked, test/robot and admin accounts never appear.
 */
import { isHiddenAccount } from "@/lib/people/hidden";

const DAY_MS = 86400000;

export const QUIET_DAY_OPTIONS = [3, 7, 14, 30] as const;
export const DEFAULT_QUIET_DAYS = 7;
export const MAX_BULK_RECIPIENTS = 500;

export type NudgeStudent = {
  id: string;
  name: string;
  email: string;
  cohortIds: string[];
  /** Latest moment on the platform (ISO), or null if never. */
  lastActiveAt: string | null;
  /** Platform hours so far. */
  hours: number;
  status?: string | null;
  role?: string | null;
  isTest?: boolean | null;
};

export type NudgeRow = NudgeStudent & {
  /** Whole days since last activity; null when never started. */
  inactiveDays: number | null;
  neverStarted: boolean;
  preselected: boolean;
};

/** Can this account ever be emailed by the quiet-student tool? */
export function isNudgeable(s: Pick<NudgeStudent, "email" | "status" | "role" | "isTest">): boolean {
  if (!s.email || !s.email.includes("@")) return false;
  if (s.status === "blocked") return false;
  if (s.role && s.role !== "student") return false;
  return !isHiddenAccount({ email: s.email, is_test: s.isTest ?? null });
}

/** Days dropdown value from a URL param; falls back to the default. */
export function parseQuietDays(v: string | null | undefined): number {
  const n = Number(v);
  return (QUIET_DAY_OPTIONS as readonly number[]).includes(n) ? n : DEFAULT_QUIET_DAYS;
}

export function inactiveDaysOf(lastActiveAt: string | null, today: Date): number | null {
  if (!lastActiveAt) return null;
  const t = new Date(lastActiveAt).getTime();
  if (Number.isNaN(t)) return null;
  return Math.max(0, Math.floor((today.getTime() - t) / DAY_MS));
}

export function selectQuietStudents(
  students: NudgeStudent[],
  opts: { cohort: "all" | string; days: number; today: Date },
): NudgeRow[] {
  const days = Math.max(1, Math.floor(opts.days));
  return students
    .filter(isNudgeable)
    .filter((s) => opts.cohort === "all" || s.cohortIds.includes(opts.cohort))
    .map((s) => {
      const inactiveDays = inactiveDaysOf(s.lastActiveAt, opts.today);
      const neverStarted = inactiveDays === null;
      return { ...s, inactiveDays, neverStarted, preselected: neverStarted || (inactiveDays as number) >= days };
    })
    .sort((a, b) => {
      if (a.neverStarted !== b.neverStarted) return a.neverStarted ? -1 : 1;
      const d = (b.inactiveDays ?? 0) - (a.inactiveDays ?? 0);
      return d !== 0 ? d : a.name.localeCompare(b.name);
    });
}

/** Put the student's first name into {name}. */
export function personalise(text: string, name: string): string {
  const first = name.trim().split(/\s+/)[0] || "there";
  return text.replace(/\{name\}/g, first);
}

export const DEFAULT_NUDGE_SUBJECT = "Your VIBHA hours are waiting";
export const DEFAULT_NUDGE_MESSAGE = `Hi {name},

We haven't seen you on VIBHA for a little while, so here's a friendly reminder.

To get your certificate, you need to complete your hours on the platform. Lectures, practice and notes all count.

Even 20 minutes today helps. If something is getting in the way, just reply to this email and tell us.

Warmly,
The VIBHA team`;
