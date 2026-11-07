import { CASES_BODY_CHILD } from "./cases-body-child";
import { CASES_MOOD_ANXIETY } from "./cases-mood-anxiety";
import { CASES_MORE } from "./cases-more";
import { CASES_PSYCHOSIS_SUBSTANCE } from "./cases-psychosis-substance";
import { withLegacyTags } from "./tags-legacy";
import type { DailyCase } from "./types";

/**
 * Every Daily Case. Server code only: the answers live here, so client
 * components must never import this file (they get a CaseView instead).
 */
export const CASES: DailyCase[] = [...CASES_MOOD_ANXIETY, ...CASES_PSYCHOSIS_SUBSTANCE, ...CASES_BODY_CHILD, ...CASES_MORE].map(withLegacyTags);

const BY_ID = new Map(CASES.map((c) => [c.id, c]));

export function caseById(id: string): DailyCase | undefined {
  return BY_ID.get(id);
}
