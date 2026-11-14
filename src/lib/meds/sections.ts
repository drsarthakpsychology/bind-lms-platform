/**
 * The order of a medicine page: the practical facts first, how it works last.
 * The medicine data has no separate "switching and stopping" list, so lines
 * from "What to tell the patient" that are about stopping or switching are
 * shown there (with the half-life from visuals.ts), and "stop if" danger
 * signs join the warnings. Nothing is reworded.
 */
import type { Med } from "./types";

export const SECTION_ORDER = ["uses", "doses", "side-effects", "monitoring", "interactions", "warnings", "groups", "stopping", "how-it-works"] as const;
export type SectionId = (typeof SECTION_ORDER)[number];

/** The anchor of the last section, so other pages can link to /practice/medicines/<id>#how-it-works. */
export const HOW_IT_WORKS = "how-it-works";

export function howItWorksHref(id: string): string {
  return `/practice/medicines/${id}#${HOW_IT_WORKS}`;
}

const STOPPING = /\b(stop|stops|stopping|stopped|taper|tapered|withdraw\w*|switch\w*|discontinu\w*)\b|reduce it slowly/i;
const SMOKING = /smok/i;

/** True when a patient line is about stopping or switching the medicine (not about stopping smoking). */
export function isStoppingLine(line: string): boolean {
  return STOPPING.test(line) && !SMOKING.test(line);
}

/** A patient line that says to stop because of a danger sign ("Stop and get help if a rash appears"): a warning. */
export function isStopIfLine(line: string): boolean {
  return /^stop\b/i.test(line.trim());
}

/** Split "What to tell the patient" into how to take it, warning signs, and switching and stopping. */
export function splitTell(med: Pick<Med, "tell">): { take: string[]; warn: string[]; stopping: string[] } {
  const take: string[] = [];
  const warn: string[] = [];
  const stopping: string[] = [];
  for (const t of med.tell) (isStopIfLine(t) ? warn : isStoppingLine(t) ? stopping : take).push(t);
  return { take, warn, stopping };
}
