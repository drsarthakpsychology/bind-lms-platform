"use server";

import { revalidatePath } from "next/cache";
import { currentUser } from "@/lib/games-sims/server/results";
import { buyHints, hintStatus, spendHint, type HintStatus } from "./server";
import { resolveHint, type HintAsk, type HintGive } from "./resolve";
import { detectiveCase } from "@/lib/learn/detective-server";
import { rxCurrent } from "@/lib/games-sims/rx/server";
import { mseCurrent } from "@/lib/games-sims/mse/server";
import { wardCurrent } from "@/lib/games-sims/ward/server";

/** The signed-in student's hints left (null when signed out). */
export async function getHintStatus(): Promise<HintStatus | null> {
  const me = await currentUser();
  if (!me) return null;
  return hintStatus(me.id);
}

/** Buy 3 hints for 30 XP (once a day). */
export async function buyHintsAction(): Promise<{ ok: boolean; error: string | null; status: HintStatus | null }> {
  const me = await currentUser();
  if (!me) return { ok: false, error: "Please sign in again.", status: null };
  const r = await buyHints(me.id);
  if (r.ok) revalidatePath("/leaderboard/shop");
  return { ok: r.ok, error: r.ok ? null : r.error, status: r.status };
}

export type HintAnswer = { ok: true; give: HintGive; status: HintStatus } | { ok: false; error: string; status: HintStatus | null };

/**
 * Use one hint in a game ("rule out two", or "a card that fits"). The server
 * works out what to show from the game's content and charges one hint.
 */
export async function askHint(input: HintAsk): Promise<HintAnswer> {
  const me = await currentUser();
  if (!me) return { ok: false, error: "Please sign in again.", status: null };
  // Clinic detective: the browser never knows the answer; it is read from the signed deal here.
  // Rx Detective: the case and step are read from the signed run here too.
  const ask: HintAsk | null = input?.game === "detective" ? withDetectiveAnswer(me.id, input) : input?.game === "rx" ? withRxCase(me.id, input) : input?.game === "mse" ? withMseFinding(me.id, input) : input?.game === "ward" ? withWardDecision(me.id, input) : input;
  const r = ask ? resolveHint(ask) : null;
  if (!r) return { ok: false, error: "That hint isn't available.", status: null };
  // One hint per item here, so asking again shows the same hint without charging.
  const spent = await spendHint(me.id, { game: r.game, item: r.item, step: 1 });
  if (!spent.ok) return { ok: false, error: spent.error, status: spent.status };
  return { ok: true, give: r.give, status: spent.status };
}

function withWardDecision(userId: string, input: Extract<HintAsk, { game: "ward" }>): HintAsk | null {
  const c = wardCurrent(userId, input.token);
  return c ? { game: "ward", run: c.run, options: [], campaign: c.campaign, decision: c.decision } : null;
}

function withMseFinding(userId: string, input: Extract<HintAsk, { game: "mse" }>): HintAsk | null {
  const c = mseCurrent(userId, input.token);
  return c ? { game: "mse", run: c.run, options: c.token.o[c.idx] ?? [], excerpt: c.excerpt.id, idx: c.idx } : null;
}

function withRxCase(userId: string, input: Extract<HintAsk, { game: "rx" }>): HintAsk | null {
  const c = rxCurrent(userId, input.token);
  return c ? { game: "rx", run: c.run, options: input.options, kind: c.ref.kind, id: c.ref.id, step: c.step } : null;
}

function withDetectiveAnswer(userId: string, input: Extract<HintAsk, { game: "detective" }>): HintAsk | null {
  const c = detectiveCase(userId, input.token, input.round);
  return c ? { ...input, answer: c.answer } : null;
}
