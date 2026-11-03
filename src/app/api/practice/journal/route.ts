import { NextResponse } from "next/server";
import { z } from "zod";
import { requireStudentApi } from "@/lib/auth/api-guard";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const journalSchema = z.object({
  content: z.string().min(1).max(8000),
  moodTag: z.string().max(30).optional(),
});

/**
 * POST /api/practice/journal — save a journal entry. Owner-only RLS.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const access = await requireStudentApi({ path: "/reflect", flag: "journal" });
  if (!access.ok) return access.response;
  const profile = access.profile;
  const user = profile;

  const allowed = await rateLimit(`journal:${user.id}`, 30);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = journalSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const { data, error } = await supabase
    .from("journal_entries")
    .insert({ user_id: user.id, content: parsed.data.content, mood_tag: parsed.data.moodTag })
    .select("id")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ id: data.id });
}
