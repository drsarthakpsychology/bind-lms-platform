"use server";

import { revalidatePath } from "next/cache";
import { currentUser } from "@/lib/games-sims/server/results";
import { buyHints, hintStatus, spendHint, type HintStatus } from "./server";
import { resolveHint, type HintAsk, type HintGive } from "./resolve";

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
  const r = resolveHint(input);
  if (!r) return { ok: false, error: "That hint isn't available.", status: null };
  // One hint per item here, so asking again shows the same hint without charging.
  const spent = await spendHint(me.id, { game: r.game, item: r.item, step: 1 });
  if (!spent.ok) return { ok: false, error: spent.error, status: spent.status };
  return { ok: true, give: r.give, status: spent.status };
}
