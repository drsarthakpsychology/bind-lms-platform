/**
 * AI follow-up question generator for the dictation conversation (A7).
 *
 * When AI is enabled, the advisor model turns the state machine's next-field
 * question into a warm natural-language follow-up. When disabled (or no
 * provider), we use the deterministic fixtures below — the flow still works
 * with zero keys, which is the hard requirement.
 *
 * Content-authoring workload (faculty dictating cases) — safe for free-tier,
 * trains-on-data providers. No student data touches this.
 */

import { nextMissingField, FIELD_QUESTION, type DictationState, collectedCount, DICTATION_FIELDS } from "@/lib/corpus/interviewer";

/** Deterministic fixture follow-ups: the state machine's own order, phrased
 *  warm and clinically. Never changes, so tests and offline demo are stable. */
export function fixtureFollowUp(state: DictationState): string {
  const next = nextMissingField(state);
  if (!next) return "That's everything I need. Tap finish to build the draft case.";
  return FIELD_QUESTION[next];
}

/** A prompt for a provider to rephrase the deterministic question warmly. */
export function corpusInterviewerPrompt(state: DictationState, question: string): string {
  const got = DICTATION_FIELDS.filter((f) => (state as Record<string, unknown>)[f]).length;
  return [
    "You are a warm, unhurried clinical supervisor informally collecting an anonymised composite case from a seasoned Indian psychiatrist.",
    "Your job is ONLY to ask the single most useful next follow-up question, in natural, short, warm language. You never write the case, never summarise, never diagnose.",
    `You need to learn: ${question}`,
    got ? `${got}/${DICTATION_FIELDS.length} fields already gathered.` : "Nothing collected yet — begin with the basics.",
    "One short, specific, clinical question. No politeness padding.",
  ].join("\n");
}

/** The question to show the faculty member next. Fixture-first. */
export function nextFollowUpQuestion(state: DictationState): string {
  return fixtureFollowUp(state);
}

/** Progress label for the UI. */
export function progressLabel(state: DictationState): string {
  const needed = collectedCount(state);
  return `${needed}/${DICTATION_FIELDS.length} fields · ${DICTATION_FIELDS.length - needed} to go`;
}