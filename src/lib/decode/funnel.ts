/**
 * The Funnel (v5 Part 1, Mode 2) — the core drill. A patient opens with a
 * vague phrase; the student gets FIVE questions to disambiguate, typed freely.
 * Scored on question EFFICIENCY.
 *
 * The funnel taught in-app:
 *   open → specify → instantiate → quantify → contextualise → attribute
 * "Walk me through yesterday morning" (instantiate) is the highest-yield
 * question in clinical interviewing.
 */

export type FunnelStep =
  | "open"          // "Tell me more about that."
  | "specify"       // "When you say fresh, what do you mean?"
  | "instantiate"   // "Walk me through yesterday morning."
  | "quantify"      // "How many days in the last two weeks?"
  | "contextualise" // "What stops you doing because of it?"
  | "attribute";    // "What do you think is causing it?" (DSM-5 CFI)

export interface FunnelAnswer {
  question: string;
  step: FunnelStep | null;
  /** how much new diagnostic signal this question earned (0-1) */
  value: number;
  hint: string;
}

const STEP_HINTS: Record<FunnelStep, string> = {
  open: "Open — 'Tell me more about that.'",
  specify: "Specify — 'When you say X, what do you mean?'",
  instantiate: "Instantiate — 'Walk me through yesterday morning.'",
  quantify: "Quantify — 'How many days in the last two weeks?'",
  contextualise: "Contextualise — 'What stops you doing because of it?'",
  attribute: "Attribute — 'What do you think is causing it?' (DSM-5 CFI)",
};

/** Classify a free-typed question into a funnel step (best-effort, local). */
export function classifyFunnelStep(q: string): FunnelStep | null {
  const t = q.toLowerCase();
  if (/tell me more|tell me about|describe|go on|what else/i.test(t)) return "open";
  if (/what do you mean|when you say|mean by/i.test(t)) return "specify";
  if (/yesterday|this morning|walk me through|take me through|last (day|night|week)|describe a (day|typical)/i.test(t)) return "instantiate";
  if (/how (many|often)|how long|days (in|out of)|frequency|times a/i.test(t)) return "quantify";
  if (/stop(s|ped)? you|prevent|affect(s|ed)? your|impact|keep you from|interfere/i.test(t)) return "contextualise";
  if (/caus(e|es|ing)|why do you think|what do you think (is|it's)|in your (view|opinion)|explain(s)? this/i.test(t)) return "attribute";
  // Closed yes/no questions are the lowest-value.
  return null;
}

export function isClosedQuestion(q: string): boolean {
  const t = q.trim().toLowerCase();
  // Open-question markers → not closed, no matter the phrasing.
  const openMarkers = /\b(what|why|how|which|when|where|who|tell me|describe|walk me|explain|about)\b/;
  if (openMarkers.test(t)) return false;
  // Starts with a helper verb (yes/no question) and isn't otherwise open.
  return /^(are|is|do|does|did|can|could|will|would|have|has|had)\b/.test(t);
}

/**
 * Score a funnel question. Efficiency: instantiate/specify/open earn most,
 * attribute earns good credit (it's CFI), closed questions earn least.
 * Repeating a step already used earns less.
 */
export function scoreFunnelQuestion(q: string, usedSteps: Set<FunnelStep | null>): { step: FunnelStep | null; value: number; hint: string } {
  const step = classifyFunnelStep(q);
  const closed = isClosedQuestion(q);
  if (closed) return { step: null, value: 0.1, hint: "Closed question — it gets you a yes or no, not a story. Try an open or instantiate question." };
  if (!step) return { step: null, value: 0.2, hint: "Unclear step — aim the funnel: open → specify → instantiate → quantify → contextualise → attribute." };
  const first = !usedSteps.has(step);
  const base: Record<FunnelStep, number> = { open: 0.8, specify: 0.9, instantiate: 1.0, quantify: 0.7, contextualise: 0.7, attribute: 0.8 };
  const value = first ? base[step] : base[step] * 0.5;
  return { step, value, hint: STEP_HINTS[step] };
}

/** The funnel is complete when the student has covered ≥4 distinct steps. */
export function funnelComplete(steps: Array<FunnelStep | null>): { complete: boolean; distinct: number } {
  const distinct = new Set(steps.filter((s): s is FunnelStep => s !== null)).size;
  return { complete: distinct >= 4, distinct };
}
