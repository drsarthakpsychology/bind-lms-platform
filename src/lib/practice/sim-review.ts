/**
 * Sim-review corrections — the faculty feedback loop (Part 3.4).
 *
 * Faculty reviews an AI-scored simulated session and either:
 *   - writes a comment that sits on top of the AI score (no score change), or
 *   - corrects the overall score (feeds the few-shot pool into future
 *     debrief scoring calls).
 *
 * Both are persisted to scoring_corrections. Only rows that actually changed
 * the score are injected as "lessons" into the scoring prompt — a pure note
 * would otherwise render as garbage (`"{}" should be scored as: {}`).
 */

import { z } from "zod";

export const correctionSchema = z.object({
  sessionId: z.string().uuid(),
  note: z.string().trim().min(1).max(4000),
  /** The AI's overall score (0-5), snapshot for history when a correction is made. */
  originalOverall: z.number().min(0).max(5).nullable().optional(),
  /** The faculty's corrected overall score (0-5). Present ⇒ feeds the loop. */
  correctedOverall: z.number().min(0).max(5).nullable().optional(),
});
export type CorrectionPayload = z.infer<typeof correctionSchema>;

/**
 * Build the scoring_corrections insert row.
 *
 * `original`/`corrected` are stored as SCALARS (numbers) so the feedback-loop
 * prompt (`"<original>" should be scored as: <corrected>`) renders cleanly.
 * Empty values become `{}` — "note only, not a score change", which the
 * debrief route filters out of the few-shot pool.
 */
export function buildCorrectionRow(
  payload: CorrectionPayload,
  correctedBy: string,
): {
  session_id: string;
  corrected_by: string;
  original: number | Record<string, never>;
  corrected: number | Record<string, never>;
  note: string;
} {
  return {
    session_id: payload.sessionId,
    corrected_by: correctedBy,
    original: payload.originalOverall != null ? payload.originalOverall : {},
    corrected: payload.correctedOverall != null ? payload.correctedOverall : {},
    note: payload.note,
  };
}

/**
 * Only corrections that changed the score feed the feedback loop. A pure note
 * (corrected === {}) is stored + shown to faculty but must never be injected
 * as a scoring "lesson".
 */
export function shouldInjectCorrection(c: {
  original: unknown;
  corrected: unknown;
}): boolean {
  const v = c.corrected;
  if (v === null || v === undefined) return false;
  if (typeof v === "object") return Object.keys(v as object).length > 0;
  return String(v).trim().length > 0;
}
