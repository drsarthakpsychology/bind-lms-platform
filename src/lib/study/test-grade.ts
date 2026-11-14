import type { LearnState } from "@/lib/learn/engine";
import type { Mcq } from "./types";

/** Stable key for one MCQ of a test (hash of the question text). */
export function mcqKey(moduleId: string, m: Pick<Mcq, "q">): string {
  let h = 2166136261;
  for (let i = 0; i < m.q.length; i++) h = Math.imul(h ^ m.q.charCodeAt(i), 16777619);
  return `${moduleId.slice(0, 120)}:${(h >>> 0).toString(36)}`;
}

/**
 * Grade a module test on the server from the student's picks (keyed by
 * mcqKey). Every question of the test counts; an unanswered one is wrong.
 */
export function gradeTest(mcqs: readonly Mcq[], moduleId: string, picks: Readonly<Record<string, unknown>>): { right: number; total: number } {
  let right = 0;
  for (const m of mcqs) if (picks[mcqKey(moduleId, m)] === m.answer) right++;
  return { right, total: mcqs.length };
}

/**
 * Store a graded result (best score kept, tries counted) without touching XP:
 * the browser already awarded the XP for this attempt in its own copy.
 */
export function withTestResult(s: LearnState, module: string, right: number, total: number, today: string): LearnState {
  const prev = s.study.tests[module];
  const best = Math.max(right, prev?.best ?? 0);
  return { ...s, study: { ...s.study, tests: { ...s.study.tests, [module]: { best, total, day: today, tries: (prev?.tries ?? 0) + 1 } } } };
}

/**
 * Module test results are owned by the server: whatever the browser sends
 * for these modules is replaced by the stored (server-graded) result.
 */
export function keepServerTests<T extends { best: number; total: number }>(
  client: Readonly<Record<string, T>>,
  server: Readonly<Record<string, T>> | undefined,
  serverOwned: readonly string[],
): Record<string, T> {
  const out: Record<string, T> = { ...client };
  for (const id of serverOwned) {
    const s = server?.[id];
    if (s) out[id] = s;
    else delete out[id];
  }
  return out;
}
