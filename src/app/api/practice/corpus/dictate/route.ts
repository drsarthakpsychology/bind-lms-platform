import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const dictateSchema = z.object({
  title: z.string().min(1).max(200),
  difficulty: z.enum(["cooperative", "guarded", "resistant", "crisis"]),
  caseData: z.record(z.string(), z.unknown()),
});

/**
 * POST /api/practice/corpus/dictate — admin (faculty) dictates a composite
 * case. Saves as sim_cases draft, source='faculty_dictated', approved=false.
 * Admin-only via RLS (sim_cases_admin_manage).
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const sessionProfile = await requireSession();
  if (!sessionProfile) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = sessionProfile;

  // Verify admin via the profiles role.
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = dictateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const { error } = await supabase.from("sim_cases").insert({
    title: parsed.data.title,
    slug: parsed.data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    difficulty: parsed.data.difficulty,
    case_data: parsed.data.caseData,
    status: "draft",
    approved: false,
    source: "faculty_dictated",
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
