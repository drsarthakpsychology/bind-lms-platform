/**
 * MSE ladder (v5 Part 2.1) — the five levels, unlocked in order.
 *
 * Level 1 — Observe: write free-text description; diagnostic terms are
 *   flagged. Score = observations kept, conclusions removed. (Already the
 *   "describe, don't diagnose" mode; this adds the scoring function.)
 * Level 2 — Domain by domain: one of the 11 domains at a time with a
 *   controlled vocabulary. Novices must not skip ahead.
 * Level 3 — Confusable pairs: mood vs affect, thought form vs content,
 *   akathisia vs anxiety, etc. (lives in ./confusable.ts).
 * Level 4 — Full MSE under time: ten minutes, complete write-up, scored
 *   against expert coding with green/amber/red per domain.
 * Level 5 — MSE from live interview: run a Consulting Room session, then
 *   write the MSE from your own transcript, scored against what the patient
 *   actually presented (the case's expert MSE coding).
 *
 * Everything here is authored data or pure logic — no prompt text.
 */

/** A case's expert MSE code — what the patient actually presents. This is
 *  what Level 5 and Level 4 score against. Authored per case (never derived
 *  from a model). */
export interface MseCode {
  caseKey: string;
  appearance: string[];
  behavior: string[];
  speech: string[];
  mood: string[];
  affect: string[];
  thought_process: string[];
  thought_content: string[];
  perception: string[];
  cognition: string[];
  insight: string[];
  judgment: string[];
  /** Observable "small things" the student should have noticed in the
   *  interview (v5 Part 2.2) — these are the missed-observation teach. */
  small_things: string[];
}

/** Level 4 is 10 minutes and scored green (matched expert) / amber
 *  (defensible alternative) / red (missed or wrong). */
export const MSE_LEVELS = ["1", "2", "3", "4", "5"] as const;
export type MseLevel = (typeof MSE_LEVELS)[number];

export const MSE_LEVEL_META: Record<MseLevel, { title: string; blurb: string; minutes: number | null }> = {
  "1": { title: "Observe", blurb: "Describe what you can see and hear. No diagnostic words.", minutes: 3 },
  "2": { title: "Domain by domain", blurb: "One domain at a time, controlled vocabulary, in order.", minutes: null },
  "3": { title: "The confusable pairs", blurb: "The distinctions students actually fail.", minutes: null },
  "4": { title: "Full MSE under time", blurb: "Ten minutes, complete write-up, scored per domain.", minutes: 10 },
  "5": { title: "MSE from live interview", blurb: "Run a Consulting Room session, then write the MSE from your own transcript.", minutes: null },
};

/** Score a 'describe, don't diagnose' attempt (Level 1).
 *  We count observations: words that describe observable behaviour.
 *  Score = observation tokens minus a hard penalty per diagnostic term. */
const OBSERVATION_HINTS = [
  "sitting", "stood", "looks", "wearing", "dressed", "groomed", "trembling",
  "fidget", "paces", "pacing", "eye contact", "avoid", "glances", "whispers",
  "monotone", "pressured", "loud", "soft", "slow", "rapid", "muttered",
  "tearful", "crying", "smiling", "laughing", "expressionless", "blank",
  "posture", "slumped", "rigid", "folded", "clench", "stooped", "restless",
  "still", "silent", "paused", "hesitat", "shrugged", "nodded", "shook",
  "clothes", "hair", "shoes", "clean", "washed", "breath", "sigh",
];

export function scoreObserve(text: string): {
  observations: number;
  penalties: number;
  score: number; // max(0, observations - 2*penalties)
  labels: string[]; // diagnostic terms found
} {
  const lower = text.toLowerCase();
  const labels = DIAGNOSTIC_TERMS_FOR_OBSERVE.filter((t) => lower.includes(t));
  const observations = OBSERVATION_HINTS.reduce((acc, h) => acc + (lower.includes(h) ? 1 : 0), 0);
  const penalties = labels.length;
  return { observations, penalties, score: Math.max(0, observations - 2 * penalties), labels };
}

/** Diagnostic/clinical terms the Level 1 observe mode flags as smuggled
 *  conclusions. A conclusion is "patient was depressed" — a label applied by
 *  the writer. Observations use behaviour words instead. */
const DIAGNOSTIC_TERMS_FOR_OBSERVE = [
  "depressed", "depressive", "depression", "anxious", "anxiety", "psychotic",
  "psychosis", "manic", "mania", "delusion", "delusional", "hallucinat",
  "paranoid", "psychopath", "antisocial", "borderline", "narcissistic",
  "histrionic", "obsess", "compulsive", "phobic", "dissociat", "bipolar",
  "schizophren", "demented", "delirious", "ptsd", "traumatised", "neurotic",
  "hysterical", "manipulative", "attention-seeking", "dramatic", "withdrawn",
];

/** Level 2 — domain by domain. The 11 domains in the order students must
 *  learn them, each with its controlled vocabulary (see practice/mse.ts) and
 *  a probe question that elicits that domain. */
export interface DomainUnit {
  domain: string;
  order: number; // the sequence students must follow
  probe: string; // the question that elicits this domain
  whatYoureLookingFor: string;
}

export const MSE_DOMAIN_ORDER = [
  "appearance", "behavior", "speech", "mood", "affect", "thought_process",
  "thought_content", "perception", "cognition", "insight", "judgment",
] as const;

export const DOMAIN_UNITS: DomainUnit[] = [
  { domain: "appearance", order: 1, probe: "Describe the patient as they sit before you.", whatYoureLookingFor: "Grooming, dress, posture, eye contact — the observable surface." },
  { domain: "behavior", order: 2, probe: "What is the patient doing as you talk?", whatYoureLookingFor: "Cooperation, restlessness, agitation, withdrawal — behaviour you can see." },
  { domain: "speech", order: 3, probe: "How is the patient speaking?", whatYoureLookingFor: "Rate, volume, tone, quantity, fluency — the how of speech, not the content." },
  { domain: "mood", order: 4, probe: "How have you been feeling inside, most days?", whatYoureLookingFor: "The patient's REPORTED, sustained inner state. Ask, don't infer." },
  { domain: "affect", order: 5, probe: "What do you observe on the patient's face as they speak?", whatYoureLookingFor: "The OBSERVED emotional range right now — flat, labile, congruent, incongruent." },
  { domain: "thought_process", order: 6, probe: "How do the patient's answers connect?", whatYoureLookingFor: "Linear, tangential, circumstantial, flight of ideas, thought blocking." },
  { domain: "thought_content", order: 7, probe: "What is the patient thinking about?", whatYoureLookingFor: "Delusions, obsessions, preoccupations, suicidality, homicidality — the what." },
  { domain: "perception", order: 8, probe: "Any unusual experiences with the senses?", whatYoureLookingFor: "Hallucinations, illusions, depersonalisation, derealisation." },
  { domain: "cognition", order: 9, probe: "Orientation, attention, memory, concentration.", whatYoureLookingFor: "Oriented x3, impaired attention/memory/concentration." },
  { domain: "insight", order: 10, probe: "What do you think is causing what you're experiencing?", whatYoureLookingFor: "Full, partial, poor, absent — graded, domain-specific, not binary." },
  { domain: "judgment", order: 11, probe: "How would you handle [a concrete future situation]?", whatYoureLookingFor: "Good, fair, poor — future and social judgment, not just insight." },
];

/** The domain fields of an MSE code (all string-array columns; excludes the
 *  key/title/small-things metadata). MseCode is assignable to a partial of
 *  this, so passing the whole expert code as the student field works. */
export type MseDomainKey = Exclude<keyof MseCode, "caseKey" | "small_things">;

/** Level 4/5 expert coding scoring: green = exact match, amber = defensible
 *  alternative (in the per-domain amber list), red = missed or wrong. */
export function scoreMseCode(
  expert: Partial<Record<MseDomainKey, string[]>>,
  student: Partial<Record<MseDomainKey, string[]>>,
  amberAlternatives: Partial<Record<MseDomainKey, string[]>> = {},
): Record<string, "green" | "amber" | "red"> {
  const domains = MSE_DOMAIN_ORDER as readonly string[];
  const out: Record<string, "green" | "amber" | "red"> = {};
  for (const d of domains) {
    const key = d as MseDomainKey;
    const expertTerms = expert[key];
    const studentTerms = student[key] ?? [];
    if (!expertTerms || expertTerms.length === 0) { out[d] = "amber"; continue; }
    const matched = studentTerms.some((s) =>
      expertTerms.some((e) => s.toLowerCase().includes(e.toLowerCase()) || e.toLowerCase().includes(s.toLowerCase())),
    );
    if (matched) { out[d] = "green"; continue; }
    const amberTerms = amberAlternatives[key] ?? [];
    const amberMatched = studentTerms.some((s) =>
      amberTerms.some((e) => s.toLowerCase().includes(e.toLowerCase())),
    );
    out[d] = amberMatched ? "amber" : "red";
  }
  return out;
}

/** Aggregate a scoring pass into a summary. */
export function summarizeMseScore(scores: Record<string, "green" | "amber" | "red">): {
  green: number; amber: number; red: number; total: number; score: number; max: number;
} {
  const vals = Object.values(scores);
  const green = vals.filter((v) => v === "green").length;
  const amber = vals.filter((v) => v === "amber").length;
  const red = vals.filter((v) => v === "red").length;
  // Green = 1, amber = 0.5, red = 0.
  return { green, amber, red, total: vals.length, score: green + amber * 0.5, max: vals.length };
}

export { MSE_VOCAB as MSE_DOMAIN_VOCAB } from "@/lib/practice/mse";