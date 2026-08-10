import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { SEED_CASES } from "@/lib/psychopharm/sim/cases";
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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

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
    simCase = SEED_CASES.find((c) => c.title === row.title) ?? null;
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

  return NextResponse.json({
    sessionId: session.id,
    difficulty: session.difficulty,
    opening:
      `Hello, I'm ${simCase.identity.name}. They said I should come and talk to someone. ` +
      `How are you doing?`,
  });
}
