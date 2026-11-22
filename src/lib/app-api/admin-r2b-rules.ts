/**
 * Pure rules for the admin phone screens added on 22 Nov 2026: every
 * student's learning in one list, and who may change an admin's rights.
 * No I/O, so each rule is tested on its own (admin-r2b-rules.test.ts).
 */
import { daysBetween, normalise, type LearnState } from "@/lib/learn/engine";
import { isBehind } from "@/lib/people/attention";
import type { InsightCatalog } from "@/lib/insights/learning";

/* ------------------------------------------------------------ learning */

export type LearnerModule = { id: string; title: string; sectionsDone: number; sections: number; testPct: number | null };
export type LearnerWeak = { label: string; why: string };

/** One student's own study, read from their saved Learn state. */
export type LearnerStudy = {
  modules: LearnerModule[];
  modulesDone: number;
  modulesTotal: number;
  sectionsDone: number;
  testsTaken: number;
  /** Mean of their best checkpoint scores, 0 to 100. */
  avgTestPct: number | null;
  /** Practice questions in Notes and Games. */
  answered: number;
  rightPct: number | null;
  xp: number;
  weak: LearnerWeak[];
  /** The last day (YYYY-MM-DD) their study shows anything. */
  lastStudyDay: string | null;
};

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
const n = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);
/** Below this best score a module counts as weak. */
export const WEAK_BELOW = 60;

function lastDay(s: LearnState): string | null {
  const days: string[] = [];
  const add = (d: unknown) => {
    if (typeof d === "string" && DAY_RE.test(d)) days.push(d);
  };
  add(s.daily.day);
  add(s.streak.lastDay);
  for (const [d, xp] of Object.entries(s.history)) if (n(xp) > 0) add(d);
  Object.values(s.study.done).forEach(add);
  Object.values(s.study.tests).forEach((t) => add(t?.day));
  return days.length ? days.sort().at(-1)! : null;
}

/** A student's study from their raw saved state. A broken or empty state gives zeros, never a throw. */
export function learnerStudy(raw: unknown, catalog: InsightCatalog): LearnerStudy {
  let s: LearnState;
  try {
    s = normalise(raw);
  } catch {
    s = normalise(null);
  }
  const doneBy = new Map<string, number>();
  for (const key of Object.keys(s.study.done)) {
    const slash = key.indexOf("/");
    if (slash > 0) doneBy.set(key.slice(0, slash), (doneBy.get(key.slice(0, slash)) ?? 0) + 1);
  }
  const modules: LearnerModule[] = catalog.modules.map((m) => {
    const t = s.study.tests[m.id];
    const total = n(t?.total);
    const valid = new Set(m.sections);
    const done = Object.keys(s.study.done).filter((k) => k.startsWith(`${m.id}/`) && valid.has(k.slice(m.id.length + 1))).length;
    return { id: m.id, title: m.title, sectionsDone: done, sections: m.sections.length, testPct: total > 0 ? Math.round(Math.max(0, Math.min(100, (n(t?.best) / total) * 100))) : null };
  });
  const tests = modules.filter((m) => m.testPct !== null).map((m) => m.testPct!);
  const label = (id: string) => {
    try {
      return catalog.conceptLabel?.(id) ?? id;
    } catch {
      return id;
    }
  };
  const weak: LearnerWeak[] = [
    ...modules
      .filter((m) => m.testPct !== null && m.testPct < WEAK_BELOW)
      .sort((a, b) => a.testPct! - b.testPct!)
      .map((m) => ({ label: m.title, why: `Checkpoint best ${m.testPct}%` })),
    ...Object.entries(s.coach.confusions)
      .filter(([k, v]) => k.includes("|") && n(v) > 1)
      .sort((a, b) => n(b[1]) - n(a[1]))
      .slice(0, 3)
      .map(([k, v]) => {
        const [a, b] = k.split("|");
        return { label: `${label(a!)} or ${label(b!)}`, why: `Mixed up ${n(v)} times` };
      }),
  ].slice(0, 4);
  const answered = Math.max(0, Math.round(n(s.answered)));
  return {
    modules,
    modulesDone: modules.filter((m) => m.sections > 0 && m.sectionsDone >= m.sections).length,
    modulesTotal: modules.length,
    sectionsDone: modules.reduce((a, m) => a + m.sectionsDone, 0),
    testsTaken: tests.length,
    avgTestPct: tests.length ? Math.round(tests.reduce((a, b) => a + b, 0) / tests.length) : null,
    answered,
    rightPct: answered ? Math.round((Math.min(n(s.correct), answered) / answered) * 100) : null,
    xp: Math.max(0, Math.round(n(s.xp))),
    weak,
    lastStudyDay: lastDay(s),
  };
}

export type LearnerRow = {
  id: string;
  name: string;
  email: string;
  cohorts: { id: string; name: string }[];
  lecturesDone: number;
  lecturesAvailable: number;
  modulesDone: number;
  modulesTotal: number;
  sectionsDone: number;
  testsTaken: number;
  avgTestPct: number | null;
  answered: number;
  rightPct: number | null;
  weak: string[];
  /** The latest of their last visit and their last study day (ISO). */
  lastActive: string | null;
  minutes7: number;
  /** Fewer than half the lectures open to them are finished. */
  behind: boolean;
  /** 0 to 100: lectures and modules finished, the one number "behind first" sorts on. */
  progress: number;
  account: string;
};

export function learnerRow(
  r: { id: string; name: string; email: string; cohorts: { id: string; name: string }[]; lecturesDone: number; lecturesAvailable: number; lastSeen: string | null; min7: number; account: string },
  study: LearnerStudy,
): LearnerRow {
  const lastStudy = study.lastStudyDay ? `${study.lastStudyDay}T12:00:00.000Z` : null;
  const lastActive = [r.lastSeen, lastStudy].filter((x): x is string => !!x && !Number.isNaN(Date.parse(x))).sort((a, b) => Date.parse(b) - Date.parse(a))[0] ?? null;
  const lec = r.lecturesAvailable ? r.lecturesDone / r.lecturesAvailable : null;
  const mod = study.modulesTotal ? study.sectionsDone / Math.max(1, study.modules.reduce((a, m) => a + m.sections, 0)) : null;
  const parts = [lec, mod].filter((x): x is number => x !== null);
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    cohorts: r.cohorts,
    lecturesDone: r.lecturesDone,
    lecturesAvailable: r.lecturesAvailable,
    modulesDone: study.modulesDone,
    modulesTotal: study.modulesTotal,
    sectionsDone: study.sectionsDone,
    testsTaken: study.testsTaken,
    avgTestPct: study.avgTestPct,
    answered: study.answered,
    rightPct: study.rightPct,
    weak: study.weak.map((w) => w.label),
    lastActive,
    minutes7: r.min7,
    behind: r.account === "active" && isBehind(r.lecturesDone, r.lecturesAvailable),
    progress: parts.length ? Math.round((parts.reduce((a, b) => a + b, 0) / parts.length) * 100) : 0,
    account: r.account,
  };
}

/** Days since a student was last active, or null when never. */
export function daysQuiet(lastActive: string | null, today: string): number | null {
  if (!lastActive) return null;
  return Math.max(0, daysBetween(lastActive.slice(0, 10), today));
}

/* -------------------------------------------------------- admin rights */

export type AdminRole = "admin" | "view_admin";
/** What a person can become: Super Admin, view-only admin, a student again, or no access at all. */
export type RoleTarget = "admin" | "view_admin" | "student" | "none";
export const ROLE_TARGETS: readonly RoleTarget[] = ["admin", "view_admin", "student", "none"];

export type RoleProblem = { code: "not_found" | "conflict" | "bad_request"; message: string; needsConfirm?: boolean } | null;

/**
 * Whether a rights change may go ahead. The last Super Admin can never lose
 * the role (someone must be able to run the site), and changing your own
 * rights needs a second, explicit confirm.
 */
export function roleChangeProblem(admins: { id: string; role: AdminRole }[], actorId: string, targetId: string, next: RoleTarget, confirmSelf: boolean): RoleProblem {
  if (!ROLE_TARGETS.includes(next)) return { code: "bad_request", message: "Pick what they should become." };
  const target = admins.find((a) => a.id === targetId);
  if (!target) return { code: "not_found", message: "That person is not an admin any more." };
  if (target.role === next) return { code: "conflict", message: "Nothing to change: they already have that." };
  const supers = admins.filter((a) => a.role === "admin").length;
  if (target.role === "admin" && next !== "admin" && supers <= 1) return { code: "conflict", message: "This is the only Super Admin. Make someone else a Super Admin first." };
  if (targetId === actorId && !confirmSelf) return { code: "conflict", message: "This changes your own rights. Confirm a second time to go ahead.", needsConfirm: true };
  return null;
}

/** The profile change for each target. "none" keeps the account and its history but blocks sign-in. */
export function roleUpdate(next: RoleTarget): { role: string; status?: "active" | "blocked"; block_reason?: string | null } {
  if (next === "none") return { role: "student", status: "blocked", block_reason: "Admin rights removed" };
  if (next === "student") return { role: "student", status: "active", block_reason: null };
  return { role: next };
}
