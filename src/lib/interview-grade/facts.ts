/** Turn a stored sim case (any shape the sim tables hold) into the grader's answer key. */
import { stripDashes } from "@/lib/ai/student-text";
import type { CaseFacts } from "./prompt";
import { topicForCase } from "./topic";

type Loose = Record<string, unknown>;
// Dashes are taken out of the key too, so the grader isn't nudged into using them.
const s = (v: unknown) => (typeof v === "string" ? stripDashes(v) : "");
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);

export function factsFromCase(title: string, difficulty: string, data: Loose | null | undefined): CaseFacts & { topic: string } {
  const d = (data ?? {}) as Loose;
  const h = (d.history ?? {}) as Loose;
  const history = ["timeline", "prior_episodes", "substance_use", "medical", "family", "treatment_history"]
    .map((k) => (s(h[k]) ? `${k.replace(/_/g, " ")}: ${s(h[k])}` : ""))
    .filter(Boolean);
  const redFlags = arr(d.red_flags).map((r) => s((r as Loose)?.content)).filter(Boolean);
  const hiddenFacts = arr(d.disclosure_rules).map((r) => s((r as Loose)?.fact)).filter(Boolean);
  const rubricTargets = arr(d.rubric_targets).filter((x): x is string => typeof x === "string");
  const presentation = s(d.presentation) || stripDashes(title);
  title = stripDashes(title);
  return {
    title,
    difficulty: s(d.difficulty) || difficulty,
    presentation,
    history,
    redFlags,
    hiddenFacts,
    rubricTargets,
    topic: topicForCase(`${presentation} ${title}`),
  };
}
