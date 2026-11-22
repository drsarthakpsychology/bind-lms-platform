import type { Step } from "@/lab/run";
import { seeded, shuffle } from "@/lab/scoring";
import type { Case } from "@/lab/data";
import { URGENCY_LABEL, type Urgency } from "./types";

export const ROUND_SIZE = 8;
const URGENCIES: Urgency[] = ["routine", "soon", "urgent"];

/** What you do in each format, in one line (shown on the case page before you start). */
export const FORMAT_HOW: Record<Case["format"], string> = {
  spotter: "Read what the patient says. Name what you are hearing.",
  differential: "Read the short case. Choose the best single answer.",
  triage: "Decide how fast this needs a doctor.",
  sort: "Put each one in the group it belongs to.",
  matching: "Find the partner for each one.",
  skill: "Choose what you would say. Every reply is explained.",
  branching: "One patient, several decisions. Each choice moves the story on.",
  timeline: "Put the events in the order they happen.",
};

export function itemCount(c: Case): number {
  if (c.format === "matching") return c.pairs.length;
  if (c.format === "branching") return c.nodes.length;
  if (c.format === "timeline") return c.events.length;
  return c.items.length;
}

/**
 * A round of questions for the six formats that are "read, then choose":
 * up to eight items, in a seeded order so a test can repeat it. Branching
 * cases and timelines have their own players.
 */
export function caseSteps(c: Case, seed = 1): Step[] {
  const rand = seeded(seed);
  const cut = <T,>(xs: readonly T[]) => shuffle(xs, rand).slice(0, ROUND_SIZE);
  switch (c.format) {
    case "spotter": {
      const name = (id: string) => c.categories.find((k) => k.id === id)?.label ?? id;
      return cut(c.items).map((it) => {
        const options = shuffle([it.answer, ...it.distractors].slice(0, 5), rand);
        return { id: it.id, context: it.quote, contextLabel: "The patient says", prompt: "What is this?", options: options.map(name), answer: options.indexOf(it.answer), why: it.explain };
      });
    }
    case "differential":
      return cut(c.items).map((it) => ({ id: it.id, context: it.vignette, prompt: it.question ?? "What is the most likely answer?", options: it.options, answer: it.answer, why: it.explain }));
    case "triage":
      return cut(c.items).map((it) => ({ id: it.id, context: it.vignette, prompt: "How urgent is this?", options: URGENCIES.map((u) => URGENCY_LABEL[u]), answer: URGENCIES.indexOf(it.answer), why: it.explain }));
    case "sort": {
      const cats = c.categories.slice(0, 5);
      return cut(c.items.filter((it) => cats.some((k) => k.id === it.category))).map((it) => ({ id: it.id, context: it.text, prompt: "Which group does this belong to?", options: cats.map((k) => k.label), answer: cats.findIndex((k) => k.id === it.category), why: it.explain }));
    }
    case "matching":
      return cut(c.pairs).map((p) => {
        const others = shuffle(c.pairs.filter((x) => x.id !== p.id), rand).slice(0, 3);
        const options = shuffle([p, ...others], rand);
        return { id: p.id, context: p.left, prompt: "Which one goes with it?", options: options.map((x) => x.right), answer: options.indexOf(p) };
      });
    case "skill":
      return cut(c.items).map((it) => {
        const rs = it.responses.slice(0, 5);
        return { id: it.id, context: it.prompt, prompt: "What do you say?", options: rs.map((r) => r.text), answer: Math.max(0, rs.findIndex((r) => r.grade === "best")), notes: rs.map((r) => r.why) };
      });
    default:
      return [];
  }
}

/** How many of the events sit in the right place (the website's orderScore, simplified to exact places). */
export function orderRight(correct: readonly string[], given: readonly string[]): number {
  return given.filter((id, i) => correct[i] === id).length;
}
