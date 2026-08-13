/**
 * MSE attempt persistence (Part 6.4) — mirror the osce_attempts pattern.
 *
 * A completed MSE level attempt is shaped client-side into an
 * MseAttemptPayload and POSTed to /api/practice/mse/attempt, where it is
 * resolved against the live mse_stimuli table (by slug) and stored. Pure,
 * tested, no network or auth.
 *
 * Levels:
 *   1 Observe      — free-text; stimulus = the vignette shown
 *   2 Domain by dom — per-stimulus rows; stimulus = the tagged vignette
 *   4 Full MSE     — session aggregate; stimulus = the last vignette
 *   5 Live MSE     — stimulus_id null; source_session_id = the sim session
 */

/** A persistence target with a stable string id: a seed stimulus, a DB row,
 *  or (Level 5) a Consulting Room session id. */
export type MseAttemptTarget = { id: string };

/** Shape of an MSE attempt payload sent from client to /api/practice/mse/attempt. */
export interface MseAttemptPayload {
  /** Seed/db stimulus slug for levels 1/2/4; null for level 5 (session-based). */
  stimulus_id: string | null;
  level: "1" | "2" | "4" | "5";
  domain?: string;
  started_at: string;
  completed_at: string;
  score?: number;
  tags?: string[];
  labels?: string[];
  observations?: number;
  picked?: string[];
  expert?: string[];
  amber?: string[];
  /** Level 5 only: the Consulting Room sim session the MSE was derived from. */
  source_session_id?: string;
}

/**
 * Build a persistence payload for an MSE attempt.
 * Pure, tested, no network or auth.
 */
export function buildMseAttemptPayload(
  stimulus: MseAttemptTarget | null,
  level: "1" | "2" | "4" | "5",
  details: {
    domain?: string;
    score?: number;
    tags?: string[];
    labels?: string[];
    observations?: number;
    picked?: string[];
    expert?: string[];
    amber?: string[];
    source_session_id?: string;
  },
  startedAt: Date,
  completedAt: Date,
): MseAttemptPayload {
  return {
    stimulus_id: stimulus?.id ?? null,
    level,
    domain: details.domain,
    started_at: startedAt.toISOString(),
    completed_at: completedAt.toISOString(),
    score: details.score,
    tags: details.tags,
    labels: details.labels,
    observations: details.observations,
    picked: details.picked,
    expert: details.expert,
    amber: details.amber,
    source_session_id: details.source_session_id,
  };
}

/**
 * Compute a 0..1 score for Level 1 "describe, don't diagnose".
 * Coverage = observation words (or the 100-word target) normalized;
 * each smuggled diagnostic label costs 0.25.
 */
export function scoreMseLevel1Attempt(
  observations: number,
  labels: string[],
  wordCount: number,
): number {
  const coverage = Math.max(
    Math.min(1, observations / 20),
    Math.min(1, wordCount / 100),
  );
  const penalty = 0.25 * labels.length;
  return Math.max(0, Math.round((coverage - penalty) * 100) / 100);
}

/**
 * Compute a 0..1 score for Level 2 domain-by-domain attempt.
 * Green tags count as 1, amber as 0.5, missed expert tags penalize.
 */
export function scoreMseLevel2Attempt(
  picked: string[],
  expert: string[],
  amber: string[],
): number {
  const pickedSet = new Set(picked);

  let score = 0;
  let maxPossible = 0;

  // Expert tags (green)
  for (const tag of expert) {
    maxPossible += 1;
    if (pickedSet.has(tag)) score += 1;
  }
  // Amber tags
  for (const tag of amber) {
    maxPossible += 0.5;
    if (pickedSet.has(tag)) score += 0.5;
  }

  return maxPossible > 0 ? Math.round((score / maxPossible) * 100) / 100 : 0;
}
