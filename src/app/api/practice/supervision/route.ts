import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const entrySchema = z.object({
  activity: z.string().min(1).max(1000),
  hours: z.number().min(0).max(200),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  supervisorName: z.string().max(120).optional(),
  supervisorEmail: z.string().email().optional().or(z.literal("")),
  competencyKey: z.string().optional(),
  // A9 transfer loop — the only evidence platform practice changes real behaviour.
  transferNote: z.string().max(2000).optional(),
  consentPromo: z.boolean().optional(),
});

/**
 * POST /api/practice/supervision — log a supervision contact hour.
 * Owner + admin RLS. Feeds the Skills Passport (competency_events, source
 * 'supervision') when a competency is tagged.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const profile = await requireSession();
  if (!profile) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = profile;

  const allowed = await rateLimit(`supervision:${user.id}`, 20);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = entrySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  // Resolve competency key → id for the passport link (optional).
  let competencyId: string | null = null;
  if (parsed.data.competencyKey) {
    const { data: comp } = await supabase
      .from("competencies")
      .select("id")
      .eq("key", parsed.data.competencyKey)
      .maybeSingle();
    competencyId = comp?.id ?? null;
  }

  const { data, error } = await supabase
    .from("supervision_entries")
    .insert({
      user_id: user.id,
      activity: parsed.data.activity,
      hours: parsed.data.hours,
      date: parsed.data.date,
      supervisor_name: parsed.data.supervisorName || null,
      supervisor_email: parsed.data.supervisorEmail || null,
      competency_id: competencyId,
      transfer_note: parsed.data.transferNote ?? null,
      consent_promo: parsed.data.consentPromo ?? false,
    })
    .select("id")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // If a competency was tagged, record a passport event too (source 'supervision').
  if (competencyId) {
    await supabase.from("competency_events").insert({
      user_id: user.id,
      competency_id: competencyId,
      source: "supervision",
      evidence: { hours: parsed.data.hours, date: parsed.data.date, activity: parsed.data.activity },
    });
  }

  return NextResponse.json({ id: data.id });
}
