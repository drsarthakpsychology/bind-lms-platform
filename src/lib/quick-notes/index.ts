/**
 * Quick Notes: the typed notes, in the audit's priority order. Pure data, no
 * server code, so tests and the module pages can import it freely.
 */
import { CRITERIA_A } from "./notes/criteria-a";
import { CRITERIA_B } from "./notes/criteria-b";
import { DIFFERENTIALS, DISTINCTIONS } from "./notes/compare";
import { PHARM } from "./notes/pharm";
import { ASSESSMENTS } from "./notes/assessment";
import { THERAPIES } from "./notes/therapy";
import { THEORIES } from "./notes/theory";
import { QUICK_ID, type QuickNote } from "./types";

export * from "./types";

/** The first 40, ADHD first (the template), then the audit's order. */
const ORDER = [
  "criteria-adhd", "criteria-mdd", "criteria-bipolar", "criteria-schizophrenia", "criteria-gad", "criteria-panic", "criteria-ocd", "criteria-ptsd", "criteria-autism", "criteria-bpd", "criteria-aud", "criteria-eating", "criteria-delirium", "criteria-ncd",
  "compare-psychosis-duration", "compare-delirium-dementia-depression", "compare-bipolar2-bpd-adhd", "compare-grief", "compare-ocd-ocpd-gad", "diff-low-mood", "diff-first-psychosis", "compare-somatic", "compare-personality-clusters",
  "pharm-antipsychotic-movement", "pharm-lithium", "pharm-antidepressants", "pharm-clozapine", "pharm-mood-stabilisers", "pharm-alcohol-withdrawal",
  "assess-mse", "assess-scales", "assess-suicide-risk", "assess-iq-personality",
  "therapy-cbt", "therapy-exposure", "therapy-dbt", "therapy-mi",
  "theory-defences", "theory-development", "theory-learning",
];

const ALL: QuickNote[] = [...CRITERIA_A, ...CRITERIA_B, ...DISTINCTIONS, ...DIFFERENTIALS, ...PHARM, ...ASSESSMENTS, ...THERAPIES, ...THEORIES];
const BY_ID = new Map(ALL.map((n) => [n.id, n]));

export const QUICK_NOTES: QuickNote[] = ORDER.map((id) => BY_ID.get(id)).filter((n): n is QuickNote => !!n);

export function quickNoteById(id: string): QuickNote | undefined {
  return QUICK_ID.test(id) ? BY_ID.get(id) : undefined;
}

/** Old Quick reference slug to the typed note that replaced it. */
export const REPLACED_SLUGS: ReadonlyMap<string, string> = new Map(QUICK_NOTES.flatMap((n) => (n.replaces ?? []).map((s) => [s, n.id] as const)));

/** A study module's Quick Notes (the reverse of each note's module link). */
export function quickNotesForModule(moduleId: string): { id: string; title: string; type: QuickNote["type"] }[] {
  return QUICK_NOTES.filter((n) => n.links.moduleId === moduleId).map((n) => ({ id: n.id, title: n.title, type: n.type }));
}
