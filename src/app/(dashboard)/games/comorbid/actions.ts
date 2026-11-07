"use server";

import { z } from "zod";
import { attemptFor, comorbidXp, replay, type Setup } from "@/lib/games-sims/comorbid/game";
import { currentUser, gradeAnswers, payXp, saveResult } from "@/lib/games-sims/server/results";

const schema = z.object({
  seed: z.string().min(4).max(40),
  mode: z.enum(["bot", "pass"]),
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  moves: z.array(z.object({ uid: z.string().max(8), action: z.enum(["play", "swap"]) })).min(1).max(80),
});

/**
 * A finished game. The server deals the same game from the seed and replays
 * every move (the bot's included), so the result and the grading can't be
 * invented. Only Player 1's plays (the signed-in student) are graded.
 */
export async function finishComorbid(input: z.infer<typeof schema>): Promise<{ ok: boolean; xp: number }> {
  const parsed = schema.safeParse(input);
  const user = await currentUser();
  if (!parsed.success || !user) return { ok: false, xp: 0 };
  const setup: Setup = { seed: parsed.data.seed, mode: parsed.data.mode, level: parsed.data.level, names: ["Player 1", "Player 2"] };
  const { game, plays } = replay(setup, parsed.data.moves);
  if (game.winner === null) return { ok: false, xp: 0 };
  const mine = plays.filter((p) => p.seat === 0);
  const attempts = mine.map(attemptFor).filter((a) => a !== null);
  await gradeAnswers(user, attempts);
  const right = mine.filter((p) => p.ev.ok).length;
  const won = game.winner === 0;
  const [, xp] = await Promise.all([
    attempts.length ? saveResult(user.id, { game: "comorbid", item: `${game.seats[0].dx}-${game.seats[1].dx}`, score: right / attempts.length, right, total: attempts.length, meta: { mode: setup.mode, level: setup.level, won, streak: 0 } }) : Promise.resolve(false),
    payXp(user.id, "comorbid", comorbidXp(won, setup.level, setup.mode, right), parsed.data.seed),
  ]);
  return { ok: true, xp };
}
