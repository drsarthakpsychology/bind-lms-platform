import type { StudyProgress } from "@/lib/learn/engine";
import { isComplete, isMastered, type EvalCtx } from "./engine";
import type { ModuleFacet } from "./rules";

/**
 * Which study modules this save finished (complete, or newly mastered), so
 * the save can award the module badge at once. Pure; the award itself is
 * idempotent on the server, so a repeat is harmless.
 */
export function newlyFinishedModules(prev: StudyProgress | null, next: StudyProgress, modules: readonly ModuleFacet[]): string[] {
  const ctx = (study: StudyProgress): EvalCtx => ({ study, xp: 0, watchSeconds: 0, modules: [...modules], courseLessons: new Map(), completedLessons: new Set() });
  const before = prev ? ctx(prev) : null;
  const after = ctx(next);
  return modules
    .filter((m) => (isComplete(after, m) && !(before && isComplete(before, m))) || (isMastered(after, m) && !(before && isMastered(before, m))))
    .map((m) => m.id);
}
