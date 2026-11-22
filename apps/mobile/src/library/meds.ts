/**
 * The medicine shapes and the rules the website's medicine pages follow,
 * copied unchanged from src/lib/meds (types.ts, search.ts, sections.ts) so
 * the app shows every medicine the same way: content unchanged, the
 * practical facts first and How it works last.
 */
import type { MedicineRow } from "@/practise/types";

export type MedGroup = "Antidepressants" | "Antipsychotics" | "Mood stabilisers" | "Anxiety and sleep" | "ADHD, dementia and addiction" | "Side-effect medicines";
export type Dose = { amount: string; label: string; use: string; student: string; clinician: string; watch?: string[] };
export type Med = {
  id: string;
  name: string;
  brands: string[];
  group: MedGroup;
  cls: string;
  forms: string;
  student: string;
  clinician: string;
  standout: string[];
  uses: string[];
  doses: Dose[];
  defaultDose: number;
  common: string[];
  serious: string[];
  checks: string[];
  interactions: string[];
  groups: { label: string; text: string }[];
  tell: string[];
  related: string[];
};
export type Mechanism = { plain: string; targets: { target: string; action: string; effect: string }[]; receptor: { name: string; pick: "Full agonist" | "Partial agonist" | "Antagonist" | "Inverse agonist"; note: string; messenger?: string }; routes: string[]; site: string };
export type MedVisual = { kind: string; data: Record<string, unknown>; half?: { hl: string; meaning: string } };
export type HalfLife = { hl: string; meaning: string };

/* ---------------------------------------------------------------- search */
const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
function close(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (b.length > a.length) j++;
    else {
      i++;
      j++;
    }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}
/** The website's searchMeds: name start, brand start, name, brand, class/group/use, then one-letter typos. */
export function searchMeds<R extends Pick<MedicineRow, "name" | "brands" | "cls" | "group" | "uses">>(rows: R[], q: string): R[] {
  const query = norm(q);
  if (!query) return rows;
  const scored: { r: R; s: number }[] = [];
  for (const r of rows) {
    const name = norm(r.name);
    const brands = r.brands.map(norm);
    const words = norm(`${r.cls} ${r.group} ${r.uses.join(" ")}`);
    let s = 0;
    if (name.startsWith(query)) s = 100;
    else if (brands.some((b) => b.startsWith(query))) s = 80;
    else if (name.includes(query)) s = 60;
    else if (brands.some((b) => b.includes(query))) s = 50;
    else if (words.includes(query)) s = 30;
    else if (query.length >= 4 && (close(name, query) || close(name.slice(0, query.length), query))) s = 20;
    if (s) scored.push({ r, s });
  }
  return scored.sort((a, b) => b.s - a.s || a.r.name.localeCompare(b.r.name)).map((x) => x.r);
}

/* -------------------------------------------------------------- sections */
export const SECTION_ORDER = ["uses", "doses", "side-effects", "monitoring", "interactions", "warnings", "groups", "stopping", "how-it-works"] as const;
export type SectionId = (typeof SECTION_ORDER)[number];
export const HOW_IT_WORKS = "how-it-works";
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
export const DOSE_NOTE = "Typical adult doses, for learning. The prescriber chooses the dose for each patient; always check the current label and local guidance.";
export const washoutLine = (hl: string) => `Half-life ${hl}. After the last dose, levels take about 4 to 5 half-lives to wash out.`;
const STOPPING = /\b(stop|stops|stopping|stopped|taper|tapered|withdraw\w*|switch\w*|discontinu\w*)\b|reduce it slowly/i;
const SMOKING = /smok/i;
export const isStoppingLine = (line: string) => STOPPING.test(line) && !SMOKING.test(line);
export const isStopIfLine = (line: string) => /^stop\b/i.test(line.trim());
export function splitTell(med: Pick<Med, "tell">): { take: string[]; warn: string[]; stopping: string[] } {
  const take: string[] = [];
  const warn: string[] = [];
  const stopping: string[] = [];
  for (const t of med.tell) (isStopIfLine(t) ? warn : isStoppingLine(t) ? stopping : take).push(t);
  return { take, warn, stopping };
}
export function shownSections(med: Pick<Med, "interactions" | "tell">, opts: { hasMechanism: boolean; visuals: number; halfLife: boolean }): SectionId[] {
  const tell = splitTell(med);
  const hasHow = opts.hasMechanism || opts.visuals > 0;
  const hasStopping = Boolean(tell.stopping.length || opts.halfLife);
  return ["uses", "doses", "side-effects", "monitoring", ...(med.interactions.length ? (["interactions"] as const) : []), "warnings", "groups", ...(hasStopping ? (["stopping"] as const) : []), ...(hasHow ? (["how-it-works"] as const) : [])];
}
