/**
 * The self-check rules the website runs in the browser for the MSE trainer,
 * the OSCE stations and the formulation, copied unchanged so the app shows
 * the same marks and sends the same records:
 *   src/lib/mse/ladder.ts            scoreObserve, scoreMseCode, summarizeMseScore, MSE_DOMAIN_ORDER, formatDomainKey
 *   src/lib/practice/mse-attempt.ts  scoreMseLevel1Attempt, scoreMseLevel2Attempt
 *   src/lib/practice/osce.ts         scoreOsce, and the 60/40 composite of osce-attempt.ts
 *   src/lib/practice/formulation.ts  scoreSort, diffNarratives
 *   src/lib/practice/competency-client.ts  the competency keys
 * None of these pay XP; they are the student's own check.
 */

export const MSE_DOMAIN_ORDER = ["appearance", "behavior", "speech", "mood", "affect", "thought_process", "thought_content", "perception", "cognition", "insight", "judgment"] as const;
export type MseDomain = (typeof MSE_DOMAIN_ORDER)[number];

/** "thought_process" to "Thought process". */
export const formatDomainKey = (key: string) =>
  key
    .split("_")
    .map((w, i) => (i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ");

const OBSERVATION_HINTS = ["sitting", "stood", "looks", "wearing", "dressed", "groomed", "trembling", "fidget", "paces", "pacing", "eye contact", "avoid", "glances", "whispers", "monotone", "pressured", "loud", "soft", "slow", "rapid", "muttered", "tearful", "crying", "smiling", "laughing", "expressionless", "blank", "posture", "slumped", "rigid", "folded", "clench", "stooped", "restless", "still", "silent", "paused", "hesitat", "shrugged", "nodded", "shook", "clothes", "hair", "shoes", "clean", "washed", "breath", "sigh"];
const DIAGNOSTIC_TERMS_FOR_OBSERVE = ["depressed", "depressive", "depression", "anxious", "anxiety", "psychotic", "psychosis", "manic", "mania", "delusion", "delusional", "hallucinat", "paranoid", "psychopath", "antisocial", "borderline", "narcissistic", "histrionic", "obsess", "compulsive", "phobic", "dissociat", "bipolar", "schizophren", "demented", "delirious", "ptsd", "traumatised", "neurotic", "hysterical", "manipulative", "attention-seeking", "dramatic", "withdrawn"];

/** Level 1: observation words, and the labels that slipped in. */
export function scoreObserve(text: string): { observations: number; labels: string[]; words: number } {
  const lower = text.toLowerCase();
  const labels = DIAGNOSTIC_TERMS_FOR_OBSERVE.filter((t) => lower.includes(t));
  const observations = OBSERVATION_HINTS.reduce((acc, h) => acc + (lower.includes(h) ? 1 : 0), 0);
  const words = text.trim().length ? text.trim().split(/\s+/).length : 0;
  return { observations, labels, words };
}
export function scoreMseLevel1Attempt(observations: number, labels: string[], wordCount: number): number {
  const coverage = Math.max(Math.min(1, observations / 20), Math.min(1, wordCount / 100));
  return Math.max(0, Math.round((coverage - 0.25 * labels.length) * 100) / 100);
}
export function scoreMseLevel2Attempt(picked: string[], expert: string[], amber: string[]): number {
  const set = new Set(picked);
  let score = 0;
  let max = 0;
  for (const t of expert) {
    max += 1;
    if (set.has(t)) score += 1;
  }
  for (const t of amber) {
    max += 0.5;
    if (set.has(t)) score += 0.5;
  }
  return max > 0 ? Math.round((score / max) * 100) / 100 : 0;
}

export type Light = "green" | "amber" | "red";
/** Level 4: each domain green (matched the expert), amber (defensible) or red (missed). */
export function scoreMseCode(expert: Partial<Record<string, string[]>>, student: Partial<Record<string, string[]>>, amberAlternatives: Partial<Record<string, string[]>> = {}): Record<string, Light> {
  const out: Record<string, Light> = {};
  for (const d of MSE_DOMAIN_ORDER) {
    const e = expert[d];
    const s = student[d] ?? [];
    if (!e || e.length === 0) {
      out[d] = "amber";
      continue;
    }
    if (s.some((x) => e.some((y) => x.toLowerCase().includes(y.toLowerCase()) || y.toLowerCase().includes(x.toLowerCase())))) {
      out[d] = "green";
      continue;
    }
    const a = amberAlternatives[d] ?? [];
    out[d] = s.some((x) => a.some((y) => x.toLowerCase().includes(y.toLowerCase()))) ? "amber" : "red";
  }
  return out;
}
export function summarizeMseScore(scores: Record<string, Light>) {
  const vals = Object.values(scores);
  const green = vals.filter((v) => v === "green").length;
  const amber = vals.filter((v) => v === "amber").length;
  const red = vals.filter((v) => v === "red").length;
  return { green, amber, red, total: vals.length, score: green + amber * 0.5, max: vals.length };
}
/** One line per domain, split on commas, new lines and semicolons (as the website's form). */
export const splitTerms = (v: string) =>
  v
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);

/** OSCE: the weighted checklist fraction and the 60/40 composite with the overall rating. */
export function osceScores(weights: number[], done: boolean[], rating: number, max: number) {
  const total = weights.reduce((a, w) => a + (w ?? 1), 0);
  const got = weights.reduce((a, w, i) => a + (done[i] ? (w ?? 1) : 0), 0);
  const checklist = total ? got / total : 0;
  const global = max ? rating / max : 0;
  return { checklist, global, composite: Math.round((checklist * 0.6 + global * 0.4) * 100) / 100 };
}

/** Formulation: the share of placed cards in the right bucket. */
export function scoreSort(placed: (string | null)[], right: string[]): number {
  const sorted = placed.map((b, i) => ({ b, r: right[i] })).filter((x) => x.b !== null);
  if (!sorted.length) return 0;
  return sorted.filter((x) => x.b === x.r).length / sorted.length;
}
/** Formulation: the model's longer words you used and missed (a diff, not a grade). */
export function diffNarratives(student: string, model: string): { missing: string[]; present: string[] } {
  const words = (s: string) => new Set(s.toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/).filter((w) => w.length > 4));
  const sw = words(student);
  const mw = words(model);
  return { missing: [...mw].filter((w) => !sw.has(w)).slice(0, 12), present: [...mw].filter((w) => sw.has(w)).slice(0, 12) };
}

export const OSCE_COMPETENCY_KEYS: Record<string, string[]> = {
  "osce-1": ["risk_assessment", "clinical_interviewing"],
  "osce-2": ["psychoeducation", "clinical_interviewing"],
  "osce-3": ["cultural_attunement", "clinical_interviewing"],
  "osce-4": ["clinical_interviewing", "differential"],
  "osce-5": ["psychoeducation", "clinical_interviewing"],
  "osce-6": ["clinical_interviewing", "cultural_attunement"],
  "osce-7": ["risk_assessment", "clinical_interviewing"],
  "osce-8": ["clinical_interviewing", "cultural_attunement"],
  "osce-9": ["risk_assessment", "clinical_interviewing", "crisis_management"],
  "osce-10": ["cultural_attunement", "clinical_interviewing"],
  "osce-11": ["risk_assessment", "clinical_interviewing", "ethics"],
  "osce-12": ["clinical_interviewing", "cultural_attunement", "ethics"],
};
