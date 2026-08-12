/**
 * Review-queue triage (v5.1 A5) — surface only what needs human eyes.
 *
 * Priority score per submission:
 *  - AI scorer confidence low, or two model passes disagreed
 *  - anything flagged concerning (risk content, distress in reflection)
 *  - a student who failed the same rubric dimension 3 sessions running
 *  - a student's very first session (always)
 *  - a random 5% sample for quality control
 *
 * Everything else auto-releases with a visible "AI-generated — not yet
 * faculty reviewed" label. Target: the queue never shows more than 10 items.
 */

export interface TriageInput {
  submissionId: string;
  isFirstSession: boolean;
  aiConfidence?: number; // 0-1
  passesDisagreed?: boolean;
  concerning?: boolean;
  repeatedFailure?: boolean; // same rubric dimension failed 3+ sessions
  randomSample?: boolean; // the 5% QC sample
}

export function priorityScore(i: TriageInput): number {
  let s = 0;
  if (i.isFirstSession) s += 5;
  if (i.concerning) s += 4;
  if (i.repeatedFailure) s += 4;
  if (i.passesDisagreed) s += 3;
  if (i.aiConfidence != null && i.aiConfidence < 0.5) s += 2;
  if (i.randomSample) s += 1;
  return s;
}

/** Whether a submission needs human eyes (priority >= 4), vs auto-released. */
export function needsReview(i: TriageInput): boolean {
  return priorityScore(i) >= 4;
}

/** "Show 34 auto-released this week as a count, not a backlog." */
export function queueSummary(inputs: TriageInput[]): { needsReview: number; autoReleased: number } {
  const needs = inputs.filter(needsReview).length;
  return { needsReview: needs, autoReleased: inputs.length - needs };
}
