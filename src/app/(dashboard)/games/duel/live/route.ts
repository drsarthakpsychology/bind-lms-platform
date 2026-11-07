import { NextResponse } from "next/server";
import { z } from "zod";
import { currentPlayer } from "@/lib/games/server";
import { answer, DuelUnavailable, join, leaveQueue, poll, queuePoll, quit, startBot } from "@/lib/games/duel/server";
import { rateLimitFast } from "./limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const body = z.discriminatedUnion("op", [
  z.object({ op: z.literal("join") }),
  z.object({ op: z.literal("queue"), matchId: z.string().uuid() }),
  z.object({ op: z.literal("leave"), matchId: z.string().uuid().optional() }),
  z.object({ op: z.literal("bot") }),
  z.object({ op: z.literal("poll"), matchId: z.string().uuid() }),
  z.object({ op: z.literal("answer"), matchId: z.string().uuid(), round: z.number().int().min(0).max(9), dx: z.number().int().min(0).max(3), feature: z.number().int().min(0).max(3) }),
  z.object({ op: z.literal("quit"), matchId: z.string().uuid() }),
]);

/**
 * POST /games/duel/live: the only door into a duel. Polled about once a
 * second by both players. Every decision (round clock, score, winner, rating)
 * is made here from server time; the browser only reports presence, answers
 * and quitting.
 */
export async function POST(req: Request) {
  const me = await currentPlayer();
  if (!me) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  if (!rateLimitFast(me.id)) return NextResponse.json({ error: "Slow down." }, { status: 429 });
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Bad request." }, { status: 400 });
  const b = parsed.data;
  try {
    switch (b.op) {
      case "join":
        return NextResponse.json(await join(me.id));
      case "queue":
        return NextResponse.json(await queuePoll(me.id, b.matchId));
      case "leave":
        await leaveQueue(me.id, b.matchId);
        return NextResponse.json({ kind: "left" });
      case "bot":
        return NextResponse.json({ kind: "match", view: await startBot(me.id) });
      case "poll": {
        const view = await poll(me.id, b.matchId);
        return view ? NextResponse.json({ kind: "match", view }) : NextResponse.json({ error: "Match not found." }, { status: 404 });
      }
      case "answer": {
        const r = await answer(me.id, b.matchId, b.round, b.dx, b.feature);
        return NextResponse.json({ kind: "match", view: r.view, error: r.error ?? null }, { status: r.view ? 200 : 400 });
      }
      case "quit": {
        const view = await quit(me.id, b.matchId);
        return NextResponse.json({ kind: "match", view });
      }
    }
  } catch (e) {
    if (e instanceof DuelUnavailable) return NextResponse.json({ error: "unavailable" }, { status: 503 });
    console.warn("duel live failed:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Something went wrong. Trying again…" }, { status: 500 });
  }
}
