import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { rateLimitFast } from "@/lib/rate-limit-fast";
import { ownerTag } from "@/lib/save/owner";
import { MAX_SAVE_BYTES, applySaves, saveItemsSchema } from "@/lib/save/apply";

export const runtime = "nodejs";

/**
 * POST /api/save: the browser outbox (src/lib/save/client.ts) sends queued
 * student work here. A plain route, not a Server Action, on purpose: a Server
 * Action's id changes with every deployment, so a tab opened before a deploy
 * could no longer save anything (Vercel logged hundreds of "Failed to find
 * Server Action" errors from lecture pages). This address never changes.
 *
 * Each save answers "ok" (stored), "retry" (keep it and send again) or "drop"
 * (it can never be stored). The whole request answers 401 when signed out (the
 * browser keeps everything) and 409 when the saves belong to another account.
 */

const MAX_BYTES = MAX_SAVE_BYTES;

const bodySchema = z.object({
  owner: z.string().min(1).max(20),
  items: saveItemsSchema,
});

export async function POST(req: Request) {
  const text = await req.text().catch(() => "");
  if (text.length > MAX_BYTES) return NextResponse.json({ error: "too large" }, { status: 413 });
  let json: unknown = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* handled below */
  }
  const body = bodySchema.safeParse(json);
  if (!body.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const session = await getSession();
  // A paused account can never save: the browser drops what it holds.
  if (session.status === "blocked") return NextResponse.json({ error: "paused" }, { status: 403 });
  if (session.status !== "ok") return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const profile = session.profile;
  if (ownerTag(profile.id) !== body.data.owner) return NextResponse.json({ error: "other account" }, { status: 409 });
  // Generous: a lecture pings every 10 s and a busy study page saves often.
  if (!rateLimitFast(`save:${profile.id}`, 240)) return NextResponse.json({ error: "slow down" }, { status: 429 });

  return NextResponse.json({ results: await applySaves(profile, body.data.items) });
}
