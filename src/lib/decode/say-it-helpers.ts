/**
 * "Say it clinically" bank: everyday phrases (many in Indian languages,
 * rendered in English) turned into the words a case sheet uses.
 *
 *   q(id, difficulty, topic, language, phrase, meaning, term, "wrong | wrong | wrong", why)
 *
 * `phrase` is what the patient or family says (original words, then the
 * English rendering in brackets when it is not English). `meaning` is what
 * the phrase usually carries. `term` is the clinical description to write.
 */
import type { PrepExam } from "@/lib/prep/types";

export type SayIt = {
  id: string;
  phrase: string;
  language: string;
  meaning: string;
  term: string;
  /** What to add or check, shown with the explanation (split from the term's brackets). */
  note?: string;
  wrong: string[];
  why: string;
  topic: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  objective: string;
  exams: PrepExam[];
  /** Study module ("module/section") for "Learn this". */
  module: string;
};

const MODULE: [RegExp, string][] = [
  [/suicid|self-harm|risk/i, "suicide"],
  [/depress|grief|mood/i, "depression"],
  [/mania|bipolar/i, "bipolar"],
  [/psychos|schizo|delusion|hallucin/i, "psychosis"],
  [/ocd|obsess/i, "ocd"],
  [/panic|anxiety|phobia|worry/i, "anxiety"],
  [/alcohol|substance|opioid|cannabis|tobacco|withdrawal/i, "substance"],
  [/trauma|ptsd/i, "trauma"],
  [/dementia|delirium|memory|cognit/i, "neurocognitive"],
  [/child|adolescent|school/i, "child"],
  [/side effect|medicine/i, "antipsychotics"],
  [/language|respect|stigma/i, "case-sheet/1-3"],
];

function moduleFor(topic: string): string {
  for (const [re, m] of MODULE) if (re.test(topic)) return m;
  return "case-sheet/1-3";
}

function examsFor(d: number): PrepExam[] {
  if (d <= 2) return ["ma-semester", "cuet-pg", "ugc-net"];
  if (d === 3) return ["ma-semester", "ugc-net", "mcp-entrance"];
  return ["ugc-net", "mcp-entrance", "md-psychiatry"];
}

function objectiveFor(d: number, term: string, wrong: string[]): string {
  const t = term.replace(/\s*\(.*\)$/, "");
  if (d === 1) return `Recognise the phrase as ${t}`;
  if (d === 2) return `Recall the case-sheet term: ${t}`;
  if (d === 3) return `Turn the patient's words into ${t}`;
  if (d === 4) return `Tell ${t} from ${wrong[0].replace(/\s*\(.*\)$/, "")}`;
  return `Write the full clinical description: ${t}`;
}

export function q(id: string, d: 1 | 2 | 3 | 4 | 5, topic: string, language: string, phrase: string, meaning: string, term: string, wrong: string, why: string): SayIt {
  const w = wrong.split(" | ").map((x) => x.trim());
  const m = term.match(/^(.*?)\s*\((.*)\)$/);
  const t = m ? m[1] : term;
  const out: SayIt = { id: `say-${id}`, phrase, language, meaning, term: t, wrong: w, why, topic, difficulty: d, objective: objectiveFor(d, t, w), exams: examsFor(d), module: moduleFor(topic) };
  if (m) out.note = m[2];
  return out;
}
