"use server";

import { currentPlayer } from "@/lib/games/server";
import { answerRun, finishRun, startRun, type AnswerResult, type FinishResult, type StartResult } from "@/lib/games/blitz/server";

export async function startBlitz(): Promise<StartResult> {
  const me = await currentPlayer();
  if (!me) return { ok: false, error: "Please sign in again." };
  return startRun(me.id);
}

export async function answerBlitz(token: string, n: number, choice: number): Promise<AnswerResult> {
  const me = await currentPlayer();
  if (!me) return { ok: false, error: "Please sign in again." };
  return answerRun(me.id, token, Number(n), Number(choice));
}

export async function finishBlitz(token: string): Promise<FinishResult> {
  const me = await currentPlayer();
  if (!me) return { ok: false, error: "Please sign in again." };
  return finishRun(me.id, token);
}
