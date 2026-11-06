import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/server";
import { skillFromPath } from "@/lib/learn/model/skills";
import { recordAttempts } from "@/lib/learn/model/server";
import { attemptsFromEvents } from "@/lib/learn/model/events";

export const runtime = "nodejs";

const event = z.object({
  type: z.enum(["widget", "game", "term", "level"]),
  kind: z.string().max(40),
  ok: z.boolean().optional(),
  score: z.number().min(0).max(1).optional(),
  prompt: z.string().max(200).optional(),
  skill: z.string().max(80).optional(),
  item: z.string().max(120).optional(),
  ms: z.number().int().min(0).max(3_600_000).optional(),
  /** Multiple choice only: what was picked and the right answer (feeds mix-ups; not stored in learn_events). */
  chosen: z.string().max(200).optional(),
  correct: z.string().max(200).optional(),
  at: z.string().datetime(),
});
const schema = z.object({ events: z.array(event).max(50), path: z.string().max(300) });

/**
 * POST /api/learn/events: a batch of learning events from the browser. Stored
 * for the student model; skill defaults to the module the page belongs to.
 * Events that carry ok/score also update the student model (ability, question
 * difficulty, spaced review, mix-ups) through recordAttempts.
 * Students and alumni only; silently ignored if the tables aren't there yet.
 */
export async function POST(req: Request) {
  const session = await getSession();
  if (session.status !== "ok" || (session.profile.role !== "student" && session.profile.role !== "alumni")) return new NextResponse(null, { status: 204 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return new NextResponse(null, { status: 400 });
  const fallbackSkill = skillFromPath(parsed.data.path);
  const rows = parsed.data.events.map((e) => ({
    user_id: session.profile.id,
    type: e.type,
    kind: e.kind,
    ok: e.ok ?? null,
    score: e.score ?? (e.ok === undefined ? null : e.ok ? 1 : 0),
    skill: e.skill ?? fallbackSkill,
    item: e.item ?? null,
    prompt: e.prompt ?? null,
    ms: e.ms ?? null,
    path: parsed.data.path.split("?")[0],
    created_at: e.at,
  }));
  try {
    await createAdminClient().from("learn_events").insert(rows);
  } catch {
    /* table not created yet: drop */
  }
  const attempts = attemptsFromEvents(rows, parsed.data.events);
  if (attempts.length) await recordAttempts(session.profile.id, attempts);
  return new NextResponse(null, { status: 204 });
}
