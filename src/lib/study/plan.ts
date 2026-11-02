import { addDays, studyKey, type StudyProgress } from "@/lib/learn/engine";
import type { Section, StudyModule } from "./types";

/**
 * The guided flow. Each module runs in the same four steps, taken from how
 * memory works (read, retrieve, space it out):
 *   1. Read      every section, in order, answering its recall check
 *   2. Write     reproduce the key framework on paper (pass 3)
 *   3. Practise  the activities for this topic (Coach, cases, games)
 *   4. Test      the module test; then re-test after 3, 7 and 21 days
 * Only one thing is ever "next".
 */

export type StepKind = "read" | "write" | "practise" | "test" | "retest";

export type Next =
  | { kind: "read"; module: StudyModule; section: Section; label: string; href: string }
  | { kind: "write"; module: StudyModule; label: string; href: string }
  | { kind: "practise"; module: StudyModule; activityId: string; label: string; href: string }
  | { kind: "test"; module: StudyModule; section: Section; label: string; href: string }
  | { kind: "retest"; module: StudyModule; section: Section; label: string; href: string; due: string }
  | { kind: "done"; label: string; href: string };

export const RETEST_GAPS = [3, 7, 21] as const;

export function readingSections(m: StudyModule): Section[] {
  return m.sections.filter((s) => !s.isTest);
}
export function testSection(m: StudyModule): Section | undefined {
  return m.sections.find((s) => s.isTest);
}

export function sectionHref(m: StudyModule, s: Section): string {
  return `/study/${m.id}/${s.id}`;
}

/** Activity link that returns to the module afterwards. */
export function activityHref(m: StudyModule, href: string): string {
  return `${href}${href.includes("?") ? "&" : "?"}from=${encodeURIComponent(`/study/${m.id}`)}`;
}

/** Day the next re-test is due, or null when none is due (not tested yet, or all re-tests done). */
export function retestDue(m: StudyModule, p: StudyProgress): string | null {
  const t = p.tests[m.id];
  if (!t) return null;
  const gap = RETEST_GAPS[t.tries - 1];
  return gap ? addDays(t.day, gap) : null;
}

export type ModuleStatus = {
  readDone: number;
  readTotal: number;
  written: boolean;
  actsDone: number;
  actsTotal: number;
  tested: boolean;
  best: number | null;
  total: number | null;
  /** 0 to 100, across the four steps. */
  pct: number;
  complete: boolean;
  seconds: number;
};

export function moduleStatus(m: StudyModule, p: StudyProgress): ModuleStatus {
  const reading = readingSections(m);
  const readDone = reading.filter((s) => p.done[studyKey(m.id, s.id)]).length;
  const written = Boolean(p.written[m.id]);
  const actsDone = m.activities.filter((a) => p.acts[m.id]?.[a.id]).length;
  const t = p.tests[m.id];
  const hasTest = Boolean(testSection(m));
  const tested = !hasTest || Boolean(t);
  const units = reading.length + 1 + m.activities.length + (hasTest ? 1 : 0);
  const doneUnits = readDone + (written ? 1 : 0) + actsDone + (hasTest && t ? 1 : 0);
  return {
    readDone,
    readTotal: reading.length,
    written,
    actsDone,
    actsTotal: m.activities.length,
    tested,
    best: t?.best ?? null,
    total: t?.total ?? null,
    pct: Math.round((doneUnits / Math.max(1, units)) * 100),
    complete: doneUnits === units,
    seconds: p.secs[m.id] ?? 0,
  };
}

/** The single next step inside one module. */
export function moduleNext(m: StudyModule, p: StudyProgress): Next | null {
  const firstUnread = readingSections(m).find((s) => !p.done[studyKey(m.id, s.id)]);
  if (firstUnread) return { kind: "read", module: m, section: firstUnread, label: `Read ${firstUnread.num} ${firstUnread.title}`, href: sectionHref(m, firstUnread) };
  if (!p.written[m.id]) return { kind: "write", module: m, label: "Write it out on paper", href: `/study/${m.id}#write` };
  const act = m.activities.find((a) => !p.acts[m.id]?.[a.id]);
  if (act) return { kind: "practise", module: m, activityId: act.id, label: act.title, href: activityHref(m, act.href) };
  const test = testSection(m);
  if (test && !p.tests[m.id]) return { kind: "test", module: m, section: test, label: "Take the module test", href: sectionHref(m, test) };
  return null;
}

/** The single next step across the whole course. Due re-tests come first; then the first unfinished module. */
export function courseNext(mods: StudyModule[], p: StudyProgress, today: string): Next {
  for (const m of mods) {
    const due = retestDue(m, p);
    const test = testSection(m);
    if (due && test && due <= today) return { kind: "retest", module: m, section: test, label: `Re-test: ${m.title}`, href: sectionHref(m, test), due };
  }
  // Resume a module the student has started but not finished, before opening a new one.
  const last = p.last ? mods.find((m) => m.id === p.last!.module) : undefined;
  if (last) {
    const n = moduleNext(last, p);
    if (n) return n;
  }
  for (const m of mods) {
    const n = moduleNext(m, p);
    if (n) return n;
  }
  return { kind: "done", label: "Course complete", href: "/study" };
}

/** Total hours studied, rounded to one decimal. */
export function hoursOf(seconds: number): string {
  const h = seconds / 3600;
  if (h < 0.1) return `${Math.round(seconds / 60)} min`;
  return `${h.toFixed(1)} h`;
}

/** "about 9 hours" style estimate. */
export function studyTime(minutes: number): string {
  if (minutes < 60) return `about ${minutes} minutes`;
  const h = Math.round(minutes / 30) / 2;
  return `about ${h % 1 === 0 ? h : h.toFixed(1)} hours`;
}
