import type { StudyProgress } from "@/lib/learn/engine";
import { MASTERY_TEST_PCT, type AnyRequirement, type ModuleFacet } from "./rules";

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
  /** Best daily streak (days). */
  streakBest?: number;
  /** Weekly league promotions, and the highest tier reached (1–5). */
  promotions?: number;
  bestTier?: number;
  duelsWon?: number;
  dailyCasesSolved?: number;
  /** Server-awarded XP (positive xp_ledger rows; spends excluded). */
  ledgerXp?: number;
};

export type EvalResult = { ok: boolean; reason: string };

const facet = (ctx: EvalCtx, moduleId: string) => ctx.modules.find((m) => m.id === moduleId);
const readDone = (study: StudyProgress, moduleId: string) => Object.keys(study.done).filter((k) => k.startsWith(`${moduleId}/`)).length;

/** A module is mastered when it is complete AND its test is at MASTERY_TEST_PCT or better. */
export function isMastered(ctx: EvalCtx, m: ModuleFacet): boolean {
  if (!isComplete(ctx, m)) return false;
  if (!m.hasTest) return true;
  const t = ctx.study.tests[m.id];
  return Boolean(t && t.total > 0 && (t.best * 100) / t.total >= MASTERY_TEST_PCT);
}

export function isComplete(ctx: EvalCtx, m: ModuleFacet): boolean {
  const read = readDone(ctx.study, m.id);
  const written = Boolean(ctx.study.written[m.id]);
  const acts = Object.keys(ctx.study.acts[m.id] ?? {}).length;
  const tested = Boolean(ctx.study.tests[m.id]);
  return read >= m.reading && written && acts >= m.activities && (m.hasTest ? tested : true);
}

const TIER_NAMES = ["Neuron", "Synapse", "Circuit", "Cortex", "Mind"];
const n = (x: unknown) => (typeof x === "number" && Number.isFinite(x) ? x : 0);

export function evaluate(req: AnyRequirement, ctx: EvalCtx): EvalResult {
  const r = evaluateRaw(req, ctx);
  // Secret milestones don't show progress until they're earned.
  if ((req as { secret?: boolean } | null)?.secret && !r.ok) return { ok: false, reason: "Secret. Keep going." };
  return r;
}

function evaluateRaw(req: AnyRequirement, ctx: EvalCtx): EvalResult {
  switch (req?.kind) {
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
    case "streak_days": {
      const best = n(ctx.streakBest);
      return { ok: best >= req.min, reason: `Best streak ${best} days (need ${req.min})` };
    }
    case "league_promoted": {
      const count = n(ctx.promotions);
      const tier = n(ctx.bestTier) || 1;
      const needCount = req.count ?? 0;
      const needTier = req.tier ?? 0;
      const ok = count >= needCount && tier >= needTier && (needCount > 0 || needTier > 0);
      const parts = [needCount ? `${count}/${needCount} promotions` : "", needTier ? `best league ${TIER_NAMES[tier - 1] ?? "Neuron"} (need ${TIER_NAMES[needTier - 1] ?? needTier})` : ""].filter(Boolean);
      return { ok, reason: parts.join(", ") || "No league target set" };
    }
    case "duels_won": {
      const won = n(ctx.duelsWon);
      return { ok: won >= req.min, reason: `${won}/${req.min} ranked duels won` };
    }
    case "daily_cases_solved": {
      const solved = n(ctx.dailyCasesSolved);
      return { ok: solved >= req.min, reason: `${solved}/${req.min} daily cases solved` };
    }
    case "module_mastered": {
      if (req.module) {
        const m = facet(ctx, req.module);
        if (!m) return { ok: false, reason: `Unknown module "${req.module}".` };
        const ok = isMastered(ctx, m);
        return { ok, reason: ok ? `Mastered ${m.title}` : `${m.title}: finish everything and score ${MASTERY_TEST_PCT}%+ on the test` };
      }
      const need = Math.max(1, req.count ?? 1);
      const done = ctx.modules.filter((m) => isMastered(ctx, m)).length;
      return { ok: done >= need, reason: `${done}/${need} modules mastered` };
    }
    case "xp_total": {
      const total = n(ctx.xp) + n(ctx.ledgerXp);
      return { ok: total >= req.min, reason: `${total} XP (need ${req.min})` };
    }
    default:
      // Kinds this engine can't check from records (e.g. "membership", or a
      // rule typed in the database that the code doesn't know yet) are given
      // by hand. Never returning undefined here keeps /achievements from
      // crashing on "Cannot read properties of undefined (reading 'reason')".
      return { ok: false, reason: "Awarded by the VIBHA team" };
  }
}
