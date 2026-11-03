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
