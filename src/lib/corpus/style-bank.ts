/**
 * Style-bank access (Part 4.3). Fiction contributes conversational texture
 * ONLY — deflection moves, hesitations, topic-shifts, hedges — with zero
 * clinical content attached. `style` chunks can never be returned for a
 * clinical query. This module is the single gate; the test asserts it.
 */

import styleBankJson from "@/../scripts/corpus/style-bank.json";

export interface StylePattern {
  kind: "deflection" | "hesitation" | "topic_shift" | "hedge" | "self_interruption" | "indirect";
  pattern: string;
  source_book: string;
  style_pattern: "style";
}

const BANK = styleBankJson as StylePattern[];

/** A clinical query is one asking about symptoms, diagnosis, treatment, risk. */
export function isClinicalQuery(q: string): boolean {
  return /(symptom|diagnos|treat|medication|dose|side[- ]effect|risk|suicid|depress|anxi|hallucin|withdraw|relapse)/i.test(q);
}

/**
 * Return style patterns for a NON-clinical query (used to seed conversational
 * texture in the patient persona). For a clinical query, returns [] — style
 * must never supply a symptom, diagnosis, or disclosure.
 */
export function stylePatternsFor(query: string, limit = 5): StylePattern[] {
  if (isClinicalQuery(query)) return [];
  const shuffled = [...BANK].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
}

/** All style patterns (for admin browsing). */
export function allStylePatterns(): StylePattern[] {
  return BANK;
}

export function styleBankSize(): number {
  return BANK.length;
}
