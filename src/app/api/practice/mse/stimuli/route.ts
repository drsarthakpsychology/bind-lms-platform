import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * GET /api/practice/mse/stimuli — the published MSE stimulus bank.
 * Students read published rows (RLS: mse_stimuli_select_published); each row
 * carries its authored expert_coding (Level 2 {expertTags, amberTags}, Level 4
 * {expert: MseCode, amber}). The ladder shapes rows into the level types and
 * falls back to static content when the DB is empty.
 */
export async function GET() {
  const supabase = await createClient();
  const profile = await requireSession();
  if (!profile) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = profile;

  const allowed = await rateLimit(`mse:stimuli:${user.id}`, 60);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const { data, error } = await supabase
    .from("mse_stimuli")
    .select("id, slug, content, domain, expert_coding, title")
    .eq("status", "published")
    .order("slug", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ stimuli: data ?? [] });
}
