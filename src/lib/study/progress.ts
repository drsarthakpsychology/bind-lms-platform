import { studyKey, type StudyProgress } from "@/lib/learn/engine";
import { readingSections, testSection } from "./plan";
import type { StudyModule } from "./types";

/**
 * Progress as a percentage (owner direction, 7 Nov 2026): what share of a
 * module the student has read or tried. A unit is
 *   - a reading section, once it is read;
 *   - a level check ("Check yourself"), once it is read or tried;
 *   - the module test, once it is tried.
 * Nothing here locks anything: it only counts.
 */
export type ModuleProgress = {
  /** Reading sections done (level checks not included). */
  read: number;
  readTotal: number;
  /** Level checks read or tried. */
  checks: number;
  checksTotal: number;
  /** The module test has been tried at least once. */
  tested: boolean;
  hasTest: boolean;
  /** 0 to 100. */
  pct: number;
};

export function moduleProgress(m: StudyModule, p: StudyProgress): ModuleProgress {
  const reading = readingSections(m);
  const plain = reading.filter((s) => !s.levelCheck);
  const levelChecks = reading.filter((s) => s.levelCheck);
  const read = plain.filter((s) => p.done[studyKey(m.id, s.id)]).length;
  const checks = levelChecks.filter((s) => p.done[studyKey(m.id, s.id)] || p.tests[`${m.id}@${s.levelCheck}`]).length;
  const hasTest = Boolean(testSection(m));
  const tested = hasTest && Boolean(p.tests[m.id]);
  const units = plain.length + levelChecks.length + (hasTest ? 1 : 0);
  const done = read + checks + (tested ? 1 : 0);
  return { read, readTotal: plain.length, checks, checksTotal: levelChecks.length, tested, hasTest, pct: units ? Math.round((done / units) * 100) : 0 };
}

/** The whole course, weighted by units (so a long module counts for more). */
export function courseProgress(mods: StudyModule[], p: StudyProgress): { pct: number; modules: { id: string; pct: number }[] } {
  let units = 0;
  let done = 0;
  const modules = mods.map((m) => {
    const r = moduleProgress(m, p);
    const u = r.readTotal + r.checksTotal + (r.hasTest ? 1 : 0);
    units += u;
    done += r.read + r.checks + (r.tested ? 1 : 0);
    return { id: m.id, pct: r.pct };
  });
  return { pct: units ? Math.round((done / units) * 100) : 0, modules };
}

/**
 * Best scores never go down. A save from an older browser copy could carry a
 * lower best (or drop a test); keep the higher of the stored and the new one,
 * and add up the attempts, so "retakes allowed, best score counts" holds.
 */
export function keepBestTests(prev: StudyProgress["tests"] | undefined, next: StudyProgress["tests"]): StudyProgress["tests"] {
  if (!prev) return next;
  const out: StudyProgress["tests"] = { ...next };
  for (const [k, old] of Object.entries(prev)) {
    const cur = out[k];
    if (!cur) {
      out[k] = old;
      continue;
    }
    const oldPct = old.best / Math.max(1, old.total);
    const curPct = cur.best / Math.max(1, cur.total);
    const days = Math.max(cur.days ?? 0, old.days ?? 0) || undefined;
    if (oldPct > curPct) out[k] = { ...cur, best: old.best, total: old.total, tries: Math.max(cur.tries, old.tries), ...(days ? { days } : {}) };
    else if (old.tries > cur.tries || (days && days !== cur.days)) out[k] = { ...cur, tries: Math.max(cur.tries, old.tries), ...(days ? { days } : {}) };
  }
  return out;
}
