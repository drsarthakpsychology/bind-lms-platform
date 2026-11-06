import { MODULES, type StudyModule } from "@/lib/study";
import { readingSections, testSection } from "@/lib/study/plan";

/**
 * Configurable achievement requirements. Each is a small, verifiable rule
 * evaluated against existing records (never against browser state):
 *   - module_complete : every reading section read + written task + every
 *     activity + the module test taken.
 *   - sections_read   : a minimum number of reading sections finished.
 *   - xp              : a minimum total Learn XP.
 *   - watch_seconds   : a minimum total recorded video playback.
 *   - course_complete : every lesson in a course finished.
 */
export type AchievementRequirement =
  | { kind: "module_complete"; module: string }
  | { kind: "sections_read"; module: string; count: number }
  | { kind: "xp"; min: number }
  | { kind: "watch_seconds"; min: number }
  | { kind: "course_complete"; course_id: string };

export const REQUIREMENT_KINDS = ["module_complete", "sections_read", "xp", "watch_seconds", "course_complete"] as const;

/**
 * Milestone requirements (src/lib/achievements/milestones.ts), checked from
 * server records only:
 *   - streak_days        : best daily streak of at least `min` days.
 *   - league_promoted    : promoted at least `count` times, and/or reached `tier`.
 *   - duels_won          : ranked duels won (xp_ledger "duel:win").
 *   - daily_cases_solved : daily cases solved (xp_ledger "daily_case:solved").
 *   - module_mastered    : a module (or `count` modules) completed with a test
 *                          score of at least MASTERY_TEST_PCT.
 *   - xp_total           : Learn XP plus server-awarded XP (spends don't lower it).
 * `secret: true` hides the progress line until it is earned.
 */
export type MilestoneRequirement = (
  | { kind: "streak_days"; min: number }
  | { kind: "league_promoted"; count?: number; tier?: number }
  | { kind: "duels_won"; min: number }
  | { kind: "daily_cases_solved"; min: number }
  | { kind: "module_mastered"; module?: string; count?: number }
  | { kind: "xp_total"; min: number }
) & { secret?: boolean };

export const MILESTONE_KINDS = ["streak_days", "league_promoted", "duels_won", "daily_cases_solved", "module_mastered", "xp_total"] as const;

/** Any rule the engine can check. */
export type AnyRequirement = AchievementRequirement | MilestoneRequirement;

/** Share of the module test needed to call a module mastered. */
export const MASTERY_TEST_PCT = 80;

/** Lightweight, content-derived facts the engine needs per study module. */
export type ModuleFacet = { id: string; title: string; reading: number; activities: number; hasTest: boolean };

/** Build the facets the completion engine evaluates against. */
export function moduleFacets(): ModuleFacet[] {
  return MODULES.map((m: StudyModule) => ({
    id: m.id,
    title: m.title,
    reading: readingSections(m).length,
    activities: m.activities.length,
    hasTest: Boolean(testSection(m)),
  }));
}

export const BADGE_TONES = ["lime", "blue", "ink", "gold", "rose"] as const;
export type BadgeTone = (typeof BADGE_TONES)[number];
