import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { SEED_CASES } from "@/lib/psychopharm/sim/cases";
import { initialState, type DepthCase } from "@/lib/sim/types";
import { drawVariant, hashString } from "@/lib/sim/variation";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const startSchema = z.object({
  caseId: z.string().uuid().optional(),
  caseTitle: z.string().optional(), // allow starting from a seed case by title
});

/**
 * POST /api/practice/sim/session
 * Start a sim session. Resolves the case (by uuid or seed title), inserts a
 * sim_sessions row (active), and returns the session + opening patient line.
 */
export async function POST(req: Request) {
  const profile = await requireSession();
  if (!profile) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = profile;

  const allowed = await rateLimit(`sim:start:${user.id}`, 10);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = startSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const admin = createAdminClient();

  let caseId: string | null = null;
  let simCase: (typeof SEED_CASES)[number] | null = null;

  if (parsed.data.caseId) {
    const { data: row } = await admin
      .from("sim_cases")
      .select("id, case_data, title")
      .eq("id", parsed.data.caseId)
      .maybeSingle();
    if (!row) return NextResponse.json({ error: "case not found" }, { status: 404 });
    caseId = row.id;
    // Prefer the authored SEED_CASES version (richest), but fall back to the
    // DB row's own case_data — story/clinical cases live only in the DB and
    // must be startable too (bug: they returned "case required").
    simCase = (SEED_CASES.find((c) => c.title === row.title) ?? row.case_data) as typeof SEED_CASES[number] | null;
  } else if (parsed.data.caseTitle) {
    const seed = SEED_CASES.find((c) => c.title === parsed.data.caseTitle);
    if (!seed) return NextResponse.json({ error: "case not found" }, { status: 404 });
    simCase = seed;
    // Upsert the seed case so it has a DB row (published, approved).
    const { data: existing } = await admin
      .from("sim_cases")
      .select("id")
      .eq("title", seed.title)
      .maybeSingle();
    if (existing) {
      caseId = existing.id;
    } else {
      const { data: ins } = await admin
        .from("sim_cases")
        .insert({
          title: seed.title,
          slug: seed.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          difficulty: seed.difficulty,
          case_data: seed,
          status: "published",
          approved: true,
          source: "hand_built",
        })
        .select("id")
        .single();
      caseId = ins?.id ?? null;
    }
  }

  if (!caseId || !simCase) return NextResponse.json({ error: "case required" }, { status: 400 });

  // Open a session.
  const { data: session, error: sessErr } = await admin
    .from("sim_sessions")
    .insert({
      case_id: caseId,
      user_id: user.id,
      status: "active",
      difficulty: simCase.difficulty,
    })
    .select("id, difficulty, status")
    .single();
  if (sessErr || !session) {
    return NextResponse.json({ error: "could not start session" }, { status: 500 });
  }

  // The patient's own opening line is the first turn of the transcript — the
  // hook in their words, from the case spec, never a generic greeting. It is
  // persisted WITH the initial state so the session always has a resume
  // point (the opening turn's state is the rewind target for turn 1).
  const opening =
    simCase.chief_complaint_in_own_words ||
    `Hello, I'm ${simCase.identity.name}. They said I should come and talk to someone. How are you doing?`;
  const variation = (simCase.variation ??
    { mood_today: ["flat"], recent_event: ["a long day"], most_defended_topic: ["the family"], opening_posture: ["came willingly"], somatic_focus: ["head"], trust_start: [3], language_mix: ["Hinglish"] }) as DepthCase["variation"];
  const initVariant = drawVariant(variation, session.id, hashString(session.id));
  // Persist the drawn variant as the session seed so rewinds are reproducible.
  await admin.from("sim_sessions").update({ seed: JSON.stringify(initVariant) }).eq("id", session.id);
  await admin.from("sim_turns").insert({
    session_id: session.id,
    user_id: user.id,
    role: "patient",
    content: opening,
    content_type: "text",
    state: initialState(session.id, initVariant),
  });

  return NextResponse.json({
    sessionId: session.id,
    difficulty: session.difficulty,
    opening,
  });
}
