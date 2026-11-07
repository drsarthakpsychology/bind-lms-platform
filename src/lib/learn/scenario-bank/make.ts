import { exams } from "@/lib/library/exams";
import type { Area, Beat, Choice, Outcome, Scenario, ScenarioDifficulty } from "../scenarios";

/**
 * Compact authoring helpers for "What would you do?".
 * A choice is [mark, text, consequence] where mark is b (best), o (okay but
 * weaker) or h (harmful). Every consequence says what happens and why, so
 * the best choice explains its reasons and each weaker choice explains what
 * it misses. Exams use letters: C cuet-pg, U ugc-net, M mcp-entrance,
 * D md-psychiatry, S ma-semester.
 */
const MARK: Record<string, Outcome> = { b: "best", o: "ok", h: "harm" };
type Raw = [string, string, string];

export function b(says: string, choices: Raw[], context?: string): Beat {
  const list: Choice[] = choices.map(([m, text, consequence]) => {
    const outcome = MARK[m];
    if (!outcome) throw new Error(`unknown mark ${m}`);
    return { text, outcome, consequence };
  });
  return context ? { says, context, choices: list } : { says, choices: list };
}

export function s(
  id: string,
  area: Area,
  topic: string,
  noteId: string,
  moduleId: string,
  difficulty: ScenarioDifficulty,
  examCode: string,
  objective: string,
  who: string,
  beats: Beat[],
): Scenario {
  return { id, area, topic, noteId, moduleId, difficulty, exams: exams(examCode), objective, who, beats };
}
