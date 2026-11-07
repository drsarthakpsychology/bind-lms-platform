"use server";

import { z } from "zod";
import { attemptsFor, rxXp, runSummary, type Answer } from "@/lib/games-sims/rx/game";
import { currentUser, gradeAnswers, payXp, saveResult } from "@/lib/games-sims/server/results";

const answer = z.object({ kind: z.enum(["chain", "mystery", "puzzle", "review"]), id: z.string().min(1).max(30), picks: z.array(z.string().max(200)).max(4) });

/** One answered question: graded again here and sent to the student model. */
export async function gradeRxAnswer(input: Answer): Promise<{ ok: boolean }> {
  const parsed = answer.safeParse(input);
  const user = await currentUser();
  if (!parsed.success || !user) return { ok: false };
  const attempts = attemptsFor(parsed.data);
  if (!attempts.length) return { ok: false };
  await gradeAnswers(user, attempts);
  return { ok: true };
}

/**
 * A finished run: scored again from the answers (lives, streak, points), stored
 * for the cohort board and paid in XP once per run.
 */
export async function finishRxRun(input: { run: string; answers: Answer[] }): Promise<{ ok: boolean; xp: number }> {
  const parsed = z.object({ run: z.string().min(4).max(40), answers: z.array(answer).min(1).max(20) }).safeParse(input);
  const user = await currentUser();
  if (!parsed.success || !user) return { ok: false, xp: 0 };
  const s = runSummary(parsed.data.answers);
  if (!s.total) return { ok: false, xp: 0 };
  const [, xp] = await Promise.all([
    saveResult(user.id, { game: "rx", item: null, score: s.got / s.total, right: s.got, total: s.total, meta: { streak: s.best, points: s.points, lives: s.lives } }),
    payXp(user.id, "rx", rxXp(s.scores), parsed.data.run),
  ]);
  return { ok: true, xp };
}
