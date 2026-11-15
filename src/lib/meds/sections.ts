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

/** The heading of each section, as the medicine page shows it. */
export const SECTION_NAMES: Record<SectionId, string> = {
  uses: "Used for",
  doses: "Doses",
  "side-effects": "Side effects",
  monitoring: "What to check",
  interactions: "Interactions",
  warnings: "Serious: act the same day",
  groups: "Special groups",
  stopping: "Switching and stopping",
  "how-it-works": "How it works",
};

/** The dose note under the dose chips. */
export const DOSE_NOTE = "Typical adult doses, for learning. The prescriber chooses the dose for each patient; always check the current label and local guidance.";

/** The washout line added to "Switching and stopping" when the half-life is known. */
export function washoutLine(hl: string): string {
  return `Half-life ${hl}. After the last dose, levels take about 4 to 5 half-lives to wash out.`;
}

/** The sections one medicine's page shows, in order (empty ones are left out). Shared by the website page and the app. */
export function shownSections(med: Pick<Med, "interactions" | "tell">, opts: { hasMechanism: boolean; visuals: number; halfLife: boolean }): SectionId[] {
  const tell = splitTell(med);
  const hasHow = opts.hasMechanism || opts.visuals > 0;
  const hasStopping = Boolean(tell.stopping.length || opts.halfLife);
  return ["uses", "doses", "side-effects", "monitoring", ...(med.interactions.length ? (["interactions"] as const) : []), "warnings", "groups", ...(hasStopping ? (["stopping"] as const) : []), ...(hasHow ? (["how-it-works"] as const) : [])];
}
