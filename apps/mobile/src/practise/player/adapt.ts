import type { ToolReveal } from "../types";
import type { Grade, Option, Step, StepKey } from "./types";

/**
 * Today's "pick one" steps (the tool engine, the question bank) as the rich
 * shape. They carry less: no hints, one why, sometimes a note per option.
 * The player leaves out what is not there.
 */
export function stepFromPick(id: string, ask: string, options: string[]): Step {
  return { id, kind: "single", prompt: ask, options: options.map((text, i): Option => ({ id: String(i), text })), hints: [] };
}

const VERDICT_GRADE: Record<"best" | "ok" | "harm", Grade> = { best: "best", ok: "acceptable", harm: "harmful" };

/** The engine's reveal for a pick step, as a rich key. `picked` is the option the student chose. */
export function keyFromReveal(options: string[], reveal: ToolReveal, picked: number, moreLabel = "More"): StepKey {
  const out: StepKey["options"] = {};
  options.forEach((_, i) => {
    const right = reveal.right.includes(i);
    // What would you do marks the picked option best, ok or harm; its line is that option's consequence.
    const mine = i === picked && reveal.verdict ? VERDICT_GRADE[reveal.verdict] : null;
    out[String(i)] = { grade: right ? "best" : (mine ?? "poor"), feedback: right ? null : (reveal.notes?.[i] ?? null), consequence: i === picked && reveal.verdict && !right ? reveal.why : null };
  });
  const pickedRight = reveal.right.includes(picked);
  return {
    options: out,
    explanation: {
      // An old bank has one line: it is the why when the answer was right; for a graded wrong pick it is that pick's consequence (above).
      whyCorrect: pickedRight || !reveal.verdict ? reveal.why : "",
      more: reveal.more ? { label: moreLabel, text: reveal.more } : null,
    },
  };
}
