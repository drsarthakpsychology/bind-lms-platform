import type { Attempt } from "./student";

/** Events that report ok/score but aren't a real test of knowledge (e.g. "show me the worked answer"). */
export const NOT_GRADED_KINDS = new Set(["worked"]);

type EventRow = { kind: string; score: number | null; skill: string | null; item: string | null };

/** Which learning events count as graded answers for the student model. */
export function attemptsFromEvents(rows: EventRow[], extra: { chosen?: string; correct?: string }[] = []): Attempt[] {
  return rows.flatMap((r, i) => {
    if (r.score === null || !Number.isFinite(r.score) || !r.skill || NOT_GRADED_KINDS.has(r.kind)) return [];
    return [{ skill: r.skill, item: r.item, outcome: r.score, chosen: extra[i]?.chosen ?? null, correct: extra[i]?.correct ?? null }];
  });
}
