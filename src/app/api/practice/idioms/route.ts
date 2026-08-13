import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * GET /api/practice/idioms — the approved idiom bank (content wiring).
 * Students read approved rows only (RLS: idioms_select_approved_or_admin).
 * The decode page merges these with the static IDIOMS so the drill always has
 * the full baseline AND picks up newly faculty-approved phrases.
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const allowed = await rateLimit(`idioms:${user.id}`, 60);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const { data, error } = await supabase
    .from("idioms")
    .select("phrase, transliteration, script, register, possible_meanings, disambiguators, trap, sources")
    .eq("approved", true)
    .order("phrase", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ idioms: data ?? [] });
}
