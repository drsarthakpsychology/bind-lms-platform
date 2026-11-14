/**
 * Joining two copies of a student's Learn state without losing marks.
 *
 * Reading marks (sections done, notes read, on-paper practice, activities, lab
 * results), study time and test results only ever grow. Before this, a save
 * replaced them wholesale, so an older copy (a second tab left open, the study
 * timer of a tab opened earlier) wiped a section the student had just marked
 * done in another tab: "I marked it complete and it did not update".
 *
 * Pure: used by the browser store and by saveLearnState on the server.
 */
import type { LearnState } from "./engine";
import { keepBestTests } from "@/lib/study/progress";

function maxMap(a: Record<string, number>, b: Record<string, number>): Record<string, number> {
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = Math.max(out[k] ?? 0, v);
  return out;
}

/** Keep the winner, but never lose reading ticks, study time or test results recorded on the other copy. */
export function mergeCopies(win: LearnState, other: LearnState): LearnState {
  const acts = { ...other.study.acts };
  for (const [m, v] of Object.entries(win.study.acts)) acts[m] = { ...(acts[m] ?? {}), ...v };
  return {
    ...win,
    notesRead: { ...other.notesRead, ...win.notesRead },
    lab: { ...other.lab, ...win.lab },
    study: {
      ...win.study,
      done: { ...other.study.done, ...win.study.done },
      written: { ...other.study.written, ...win.study.written },
      secs: maxMap(win.study.secs, other.study.secs),
      acts,
      tests: keepBestTests(other.study.tests, win.study.tests),
      last: win.study.last ?? other.study.last,
    },
  };
}

const missing = (a: Record<string, unknown>, b: Record<string, unknown>) => Object.keys(a).some((k) => !(k in b));

/** True when `a` holds something `b` lacks (so `a` should be sent to the server). */
export function aheadOf(a: LearnState, b: LearnState): boolean {
  if (a.xp > b.xp) return true;
  if (missing(a.notesRead, b.notesRead) || missing(a.lab, b.lab)) return true;
  if (missing(a.study.done, b.study.done) || missing(a.study.written, b.study.written)) return true;
  for (const [m, v] of Object.entries(a.study.acts)) if (missing(v, b.study.acts[m] ?? {})) return true;
  for (const [m, s] of Object.entries(a.study.secs)) if (s > (b.study.secs[m] ?? 0)) return true;
  for (const [k, t] of Object.entries(a.study.tests)) {
    const o = b.study.tests[k];
    if (!o || t.best / Math.max(1, t.total) > o.best / Math.max(1, o.total) || t.tries > o.tries) return true;
  }
  const la = a.study.last;
  const lb = b.study.last;
  if (la && (!lb || la.module !== lb.module || la.section !== lb.section)) return true;
  if (a.dailyGoal !== b.dailyGoal) return true;
  return false;
}
