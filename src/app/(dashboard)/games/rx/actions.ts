"use server";

import { z } from "zod";
import { attemptsFor, rxXp, runSummary, type Answer } from "@/lib/games-sims/rx/game";
import { MYSTERIES } from "@/lib/games-sims/rx/content";
import { currentUser, gradeAnswers, payXp, saveResult } from "@/lib/games-sims/server/results";
import { hintedItems } from "@/lib/hints/server";
import { cappedOutcome, itemKey, POINTS_KEPT } from "@/lib/hints/rules";

const answer = z.object({ kind: z.enum(["chain", "mystery", "puzzle"]), id: z.string().min(1).max(30), picks: z.array(z.string().max(200)).max(4) });
const runId = z.string().min(4).max(40);

/** Was a hint used on this question in this run? (Counted on the server.) */
function hintedIn(map: Map<string, number>, run: string, id: string): boolean {
  const base = itemKey("rx", run, id);
  return [...map.keys()].some((k) => k === base || k.startsWith(`${base}.`));
}

/** One answered question: graded again here and sent to the student model (a hinted one counts for less). */
export async function gradeRxAnswer(input: Answer & { run?: string }): Promise<{ ok: boolean }> {
  const parsed = answer.extend({ run: runId.optional() }).safeParse(input);
  const user = await currentUser();
  if (!parsed.success || !user) return { ok: false };
  // Four options a step (the mysteries carry their own), for the guessing floor.
  const options = parsed.data.kind === "mystery" ? (MYSTERIES.find((m) => m.id === parsed.data.id)?.options.length ?? 4) : 4;
  let attempts = attemptsFor(parsed.data).map((a) => ({ ...a, options }));
  if (!attempts.length) return { ok: false };
  const run = parsed.data.run;
  if (run) {
    const hinted = await hintedItems(user.id, itemKey("rx", run, "")).catch(() => new Map<string, number>());
    if (hintedIn(hinted, run, parsed.data.id)) attempts = attempts.map((a) => ({ ...a, outcome: cappedOutcome(a.outcome, 1) }));
  }
  await gradeAnswers(user, attempts);
  return { ok: true };
}

/**
 * A finished run: scored again from the answers (lives, streak, points), stored
 * for the cohort board and paid in XP once per run. A hinted question pays
 * half its XP.
 */
export async function finishRxRun(input: { run: string; answers: Answer[] }): Promise<{ ok: boolean; xp: number }> {
  const parsed = z.object({ run: runId, answers: z.array(answer).min(1).max(20) }).safeParse(input);
  const user = await currentUser();
  if (!parsed.success || !user) return { ok: false, xp: 0 };
  const s = runSummary(parsed.data.answers);
  if (!s.total) return { ok: false, xp: 0 };
  const { run } = parsed.data;
  const hinted = await hintedItems(user.id, itemKey("rx", run, "")).catch(() => new Map<string, number>());
  const scores = s.scores.map((x, i) => (hintedIn(hinted, run, parsed.data.answers[i]?.id ?? "") ? x * POINTS_KEPT[1] : x));
  const [, xp] = await Promise.all([
    saveResult(user.id, { game: "rx", item: null, score: s.got / s.total, right: s.got, total: s.total, meta: { streak: s.best, points: s.points, lives: s.lives, hints: hinted.size } }),
    payXp(user.id, "rx", rxXp(scores), run),
  ]);
  return { ok: true, xp };
}
