import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { learnEventsSchema, storeLearnEvents } from "@/lib/learn/events-store";

export const runtime = "nodejs";

/**
 * POST /api/learn/events: a batch of learning events from the browser. Stored
 * for the student model; skill defaults to the module the page belongs to.
 * Events that carry ok/score also update the student model (ability, question
 * difficulty, spaced review, mix-ups) through recordAttempts.
 * Students and alumni only. A failed write answers 503 so the browser keeps
 * the batch and sends it again (it used to answer 204 and drop it).
 */
export async function POST(req: Request) {
  const session = await getSession();
  if (session.status !== "ok" || (session.profile.role !== "student" && session.profile.role !== "alumni")) return new NextResponse(null, { status: 204 });
  const parsed = learnEventsSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return new NextResponse(null, { status: 400 });
  const r = await storeLearnEvents(session.profile.id, parsed.data);
  return new NextResponse(null, { status: r === "retry" ? 503 : 204 });
}
