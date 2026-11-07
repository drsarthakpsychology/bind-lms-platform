/**
 * Builder for the MSE Trainer tagging bank (Level 2). Pure, no React.
 *
 *   s(id, domain, difficulty, topic, content, "expert; tags", "amber; tags", why, objective?)
 *
 * Tags are separated by ";" because the controlled words contain spaces.
 */
import type { PrepExam } from "@/lib/prep/types";
import { gloss } from "./mse-gloss";
import type { MseDomain, MseStimulus } from "./mse";

const MODULE: Record<MseDomain, string> = {
  appearance: "mse-deep/1-2", behavior: "mse-deep/1-2", speech: "mse-deep/2-1", mood: "mse-deep/1-3", affect: "mse-deep/1-3",
  thought_content: "mse-deep/2-2", thought_process: "mse-deep/2-1", perception: "mse-deep/2-3", cognition: "mse-deep/2-4",
  insight: "mse-deep/2-5", judgment: "mse-deep/2-5",
};

export function stimulusExams(d: number): PrepExam[] {
  if (d <= 2) return ["ma-semester", "cuet-pg", "ugc-net"];
  if (d === 3) return ["ma-semester", "ugc-net", "mcp-entrance"];
  return ["ugc-net", "mcp-entrance", "md-psychiatry"];
}

const NAME: Record<MseDomain, string> = {
  appearance: "appearance", behavior: "behaviour", speech: "speech", mood: "mood", affect: "affect", thought_content: "thought content",
  thought_process: "thought form", perception: "perception", cognition: "cognition", insight: "insight", judgment: "judgement",
};

const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

/** A short explanation gets the meaning of the expert word, and of the amber alternative, added. */
export function teach(why: string, domain: MseDomain, expert: string[], amber: string[]): string {
  if (why.length >= 110) return why;
  const parts = [why];
  const g = gloss(domain, expert[0]);
  if (g) parts.push(`${cap(expert[0])} means ${g}.`);
  const ga = amber[0] ? gloss(domain, amber[0]) : undefined;
  if (ga) parts.push(`${cap(amber[0])} (${ga}) is only a partial fit here.`);
  return parts.join(" ");
}

const tags = (x: string) => x.split(";").map((t) => t.trim()).filter(Boolean);

export function s(
  id: string,
  domain: MseDomain,
  d: 1 | 2 | 3 | 4 | 5,
  topic: string,
  content: string,
  expert: string,
  amber: string,
  why: string,
  objective?: string,
): MseStimulus {
  const e = tags(expert);
  const a = tags(amber);
  const n = NAME[domain];
  const obj =
    objective ??
    (d === 1 ? `Recognise ${e[0]} in ${n}`
      : d === 2 ? `Name the ${n} finding: ${e.join(", ")}`
      : d === 3 ? `Tag ${n} without sliding into another domain`
      : d === 4 ? `Tell ${e[0]} from ${a[0] ?? "its look-alike"}`
      : `Tag a mixed ${n} picture in full`);
  return { id: `mse-${id}`, content, domain, expertTags: e, amberTags: a, why: teach(why, domain, e, a), topic, difficulty: d, objective: obj, exams: stimulusExams(d), module: MODULE[domain] };
}
