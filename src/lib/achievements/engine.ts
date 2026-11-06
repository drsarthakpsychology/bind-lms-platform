import type { StudyProgress } from "@/lib/learn/engine";
import type { AchievementRequirement, ModuleFacet } from "./rules";

/**
 * Pure completion engine. Evaluates one configurable requirement against the
 * student's VERIFIED records (study progress, XP, video watch time, lesson
 * completion) — never against browser state. Returns whether the requirement
 * is satisfied and a human-readable reason for the audit trail.
 *
 * Idempotent by construction: it is a pure predicate over recorded facts, so
 * re-running it never duplicates a credential (the caller's unique index does
 * the deduplication).
 */

export type EvalCtx = {
  study: StudyProgress;
  xp: number;
  watchSeconds: number;
  modules: ModuleFacet[];
  /** course id → its lesson ids (for course_complete). */
  courseLessons: Map<string, string[]>;
  /** lesson ids the student has marked complete. */
  completedLessons: Set<string>;
};

export type EvalResult = { ok: boolean; reason: string };

const facet = (ctx: EvalCtx, moduleId: string) => ctx.modules.find((m) => m.id === moduleId);
const readDone = (study: StudyProgress, moduleId: string) => Object.keys(study.done).filter((k) => k.startsWith(`${moduleId}/`)).length;

export function evaluate(req: AchievementRequirement, ctx: EvalCtx): EvalResult {
  switch (req.kind) {
    case "module_complete": {
      const m = facet(ctx, req.module);
      if (!m) return { ok: false, reason: `Unknown module "${req.module}".` };
      const read = readDone(ctx.study, m.id);
      const written = Boolean(ctx.study.written[m.id]);
      const acts = Object.keys(ctx.study.acts[m.id] ?? {}).length;
      const tested = Boolean(ctx.study.tests[m.id]);
      const ok = read >= m.reading && written && acts >= m.activities && (m.hasTest ? tested : true);
      return {
        ok,
        reason: ok
          ? `Completed ${m.title} (${read}/${m.reading} sections, ${acts}/${m.activities} activities, test ${tested ? "taken" : "not required"})`
          : `${m.title}: ${read}/${m.reading} sections, ${written ? "" : "written task missing, "}${acts}/${m.activities} activities${m.hasTest && !tested ? ", test not taken" : ""}`,
      };
    }
    case "sections_read": {
      const m = facet(ctx, req.module);
      const read = readDone(ctx.study, req.module);
      const ok = read >= req.count;
      return {
        ok,
        reason: ok ? `Read ${req.count}+ sections of ${m?.title ?? req.module}` : `${read}/${req.count} sections of ${m?.title ?? req.module}`,
      };
    }
    case "xp":
      return { ok: ctx.xp >= req.min, reason: `${ctx.xp} XP (need ${req.min})` };
    case "watch_seconds":
      return { ok: ctx.watchSeconds >= req.min, reason: `${Math.round(ctx.watchSeconds / 60)} min watched (need ${Math.round(req.min / 60)} min)` };
    case "course_complete": {
      const lessons = ctx.courseLessons.get(req.course_id) ?? [];
      const missing = lessons.filter((id) => !ctx.completedLessons.has(id));
      const ok = lessons.length > 0 && missing.length === 0;
      return { ok, reason: ok ? `Completed all ${lessons.length} lectures` : `${lessons.length - missing.length}/${lessons.length} lectures completed` };
    }
    default:
      // Kinds this engine can't check from records (e.g. "membership", or a
      // rule typed in the database that the code doesn't know yet) are given
      // by hand. Never returning undefined here keeps /achievements from
      // crashing on "Cannot read properties of undefined (reading 'reason')".
      return { ok: false, reason: "Awarded by the VIBHA team" };
  }
}
