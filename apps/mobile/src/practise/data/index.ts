/**
 * The two word lists the website ships to the browser (no answers in them):
 * the diagnoses players guess from (src/lib/games/diagnoses.ts) and the MSE
 * words (src/lib/games-sims/mse/terms.ts). Generated into dictionaries.json.
 */
import raw from "./dictionaries.json";

export type Diagnosis = { id: string; name: string; chapter: string };
export const DIAGNOSES: Diagnosis[] = raw.DIAGNOSES as Diagnosis[];
export const CHAPTERS: Record<string, { name: string }> = raw.CHAPTERS as Record<string, { name: string }>;
export const MSE_TERMS: Record<string, { label: string; domain: string; def: string }> = raw.MSE_TERMS as Record<string, { label: string; domain: string; def: string }>;
export const MSE_DOMAINS: { id: string; label: string; short: string }[] = raw.MSE_DOMAINS as { id: string; label: string; short: string }[];

export const termLabel = (id: string) => MSE_TERMS[id]?.label ?? id;
export const diagnosisName = (id: string) => DIAGNOSES.find((d) => d.id === id)?.name ?? id;

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
/** Diagnoses matching a typed name: starts-with first, then contains. */
export function findDiagnoses(q: string, limit = 8): Diagnosis[] {
  const n = norm(q);
  if (!n) return [];
  const starts = DIAGNOSES.filter((d) => norm(d.name).startsWith(n) || norm(d.name).split(" ").some((w) => w.startsWith(n)));
  const has = DIAGNOSES.filter((d) => !starts.includes(d) && norm(d.name).includes(n));
  return [...starts, ...has].slice(0, limit);
}
