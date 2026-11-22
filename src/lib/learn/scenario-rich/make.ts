import { SCENARIO_BANK } from "../scenario-bank";
import type { Beat, Choice, Outcome, Scenario } from "../scenarios";

const MARK: Record<string, Outcome> = { b: "best", o: "ok", h: "harm" };

/** [mark, choice text, what happens and why]. Mark b best, o acceptable but weaker, h harmful. */
type RawChoice = [string, string, string];
type RawBeat = { says: string; context?: string; hints: [string, string, string]; choices: RawChoice[] };

/**
 * A rich case keeps the old case's id, area, topic, links and exam tags (so
 * answer history and the study links carry on) and replaces what the
 * student reads: the starting picture, 4 or 5 choices per step with a
 * result and reason each, three hints, and what to take away.
 */
export function rich(
  id: string,
  o: { who?: string; objective?: string; setting: string; lines: string[]; beats: RawBeat[]; concept: string; point: string; errors: string[] },
): Scenario {
  const base = SCENARIO_BANK.find((x) => x.id === id);
  if (!base) throw new Error(`rich: unknown case ${id}`);
  const beats: Beat[] = o.beats.map((b) => ({
    says: b.says,
    ...(b.context ? { context: b.context } : {}),
    hints: b.hints,
    choices: b.choices.map(([m, text, consequence]): Choice => {
      const outcome = MARK[m];
      if (!outcome) throw new Error(`rich ${id}: unknown mark ${m}`);
      return { text, outcome, consequence };
    }),
  }));
  return {
    ...base,
    who: o.who ?? base.who,
    objective: o.objective ?? base.objective,
    opening: { setting: o.setting, lines: o.lines },
    beats,
    learn: { concept: o.concept, point: o.point, errors: o.errors },
  };
}
