import type { FiveP } from "./formulation";

/**
 * Formulation attempt persistence (Part 6.2) — mirror the osce/mse pattern.
 *
 * A completed Formulation Forge pass (sort + narrative + diff) is shaped
 * client-side into an FormulationAttemptPayload and POSTed to
 * /api/practice/formulation/attempt. Pure, tested, no network or auth.
 */

/** A factor the student placed (bucket = null means unplaced/unsorted). */
export interface SortedFactor {
  factorId: string;
  bucket: FiveP | "distractor" | null;
}

/** Shape of a formulation attempt payload sent to /api/practice/formulation/attempt. */
export interface FormulationAttemptPayload {
  /** Seed case slug (e.g. "form-1") for the scaffolded stages 1-3. */
  case_id: string | null;
  /** Display title, used only if the route must create the case row. */
  case_title?: string;
  /** Stage 4 (own transcript): the Consulting Room sim session formulated. */
  source_sim_session_id?: string;
  sorted_factors: SortedFactor[];
  narrative: string;
  diff: { missing: string[]; present: string[] };
  /** 0..1 sort accuracy vs the model. */
  score?: number;
  started_at: string;
  completed_at: string;
}

/**
 * Build a persistence payload for a completed Formulation pass.
 * Pure, tested, no network or auth.
 */
export function buildFormulationAttemptPayload(
  input: {
    caseId: string | null;
    caseTitle?: string;
    sourceSimSessionId?: string;
    sortedFactors: SortedFactor[];
    narrative: string;
    diff: { missing: string[]; present: string[] };
    score?: number;
  },
  startedAt: Date,
  completedAt: Date,
): FormulationAttemptPayload {
  return {
    case_id: input.caseId,
    case_title: input.caseTitle,
    source_sim_session_id: input.sourceSimSessionId,
    sorted_factors: input.sortedFactors,
    narrative: input.narrative,
    diff: input.diff,
    score: input.score,
    started_at: startedAt.toISOString(),
    completed_at: completedAt.toISOString(),
  };
}
