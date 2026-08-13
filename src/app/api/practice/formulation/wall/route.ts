import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const postSchema = z.object({
  narrative: z.string().min(40).max(4000),
  caseTitle: z.string().max(200).default("Sim session"),
});

/**
 * POST /api/practice/formulation/wall — post an anonymised formulation
 * narrative to the peer-critique wall (author stored, never shown).
 * GET  — list the cohort's narratives (author_id nulled via the view).
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const profile = await requireSession();
  if (!profile) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = profile;

  const allowed = await rateLimit(`formwall:${user.id}`, 20);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const { data, error } = await supabase
    .from("formulation_wall_posts")
    .insert({ author_id: user.id, narrative: parsed.data.narrative, case_title: parsed.data.caseTitle })
    .select("id")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ id: data.id });
}

export async function GET() {
  const supabase = await createClient();
  const profile = await requireSession();
  if (!profile) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // The view nulls author_id — anonymity is structural, not optional.
  const { data, error } = await supabase
    .from("formulation_wall_visible")
    .select("id, narrative, case_title, created_at")
    .order("created_at", { ascending: false })
    .limit(30);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ posts: data ?? [] });
}
