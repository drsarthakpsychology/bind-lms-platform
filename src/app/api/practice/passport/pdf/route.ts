import { NextResponse } from "next/server";
import { requireStudentApi } from "@/lib/auth/api-guard";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { generatePassportPdf } from "@/lib/passport-pdf";
import { istToday } from "@/lib/practice/streaks";

export const runtime = "nodejs";

/**
 * GET /api/practice/passport/pdf: download the student's own Skills Passport
 * as a PDF. Owner-only: reads this student's competencies + events (RLS
 * scopes to the caller).
 */
export async function GET() {
  const supabase = await createClient();
  const access = await requireStudentApi({ path: "/passport", flag: "skills_passport" });
  if (!access.ok) return access.response;
  const sessionProfile = access.profile;
  const user = sessionProfile;

  const allowed = await rateLimit(`passport:pdf:${user.id}`, 5);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, name")
    .eq("id", user.id)
    .maybeSingle();

  const [{ data: competencies }, { data: events }] = await Promise.all([
    supabase.from("competencies").select("id, key, name, description").order("display_order"),
    supabase
      .from("competency_events")
      .select("competency_id, evidence")
      .eq("user_id", user.id),
  ]);

  const hoursByComp = new Map<string, number>();
  for (const e of events ?? []) {
    const h = Number((e.evidence as Record<string, unknown> | null)?.hours ?? 0);
    hoursByComp.set(e.competency_id, (hoursByComp.get(e.competency_id) ?? 0) + (Number.isFinite(h) ? h : 0));
  }

  const pdf = await generatePassportPdf({
    // Their name on the passport, not their email address.
    studentName: (typeof profile?.name === "string" && profile.name.trim()) || profile?.email || "Student",
    rows: (competencies ?? []).map((c) => ({
      name: c.name as string,
      description: (c.description as string | null) ?? undefined,
      hours: hoursByComp.get(c.id) ?? 0,
      evidenced: hoursByComp.has(c.id),
    })),
    // India date: before 05:30 IST the UTC date is still yesterday.
    issuedAt: istToday(),
  });

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="skills-passport-${user.id.slice(0, 8)}.pdf"`,
    },
  });
}
