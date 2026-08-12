import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const schema = z.object({
  action: z.enum(["publish", "schedule", "unpublish", "grant_cohort"]),
  ids: z.array(z.string().uuid()).min(1),
  targetEmail: z.string().email().optional(),
});

/**
 * POST /api/admin/modules — bulk module actions. Admin-only.
 * publish/schedule/unpublish flip module state; grant_cohort grants access
 * to the whole cohort or a single student.
 */
export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const supabase = createAdminClient();

  if (parsed.data.action === "publish" || parsed.data.action === "schedule" || parsed.data.action === "unpublish") {
    const state = parsed.data.action === "publish" ? "published" : parsed.data.action === "schedule" ? "scheduled" : "archived";
    const update: { state: string; release_at?: string } = { state };
    if (state === "scheduled") {
      update.release_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // +7 days default
    }
    const { error } = await supabase.from("modules").update(update).in("id", parsed.data.ids);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  // grant_cohort — grant to the cohort (scope='cohort') or one student by email.
  let studentId: string | null = null;
  if (parsed.data.targetEmail) {
    const { data: s } = await supabase.from("profiles").select("id").eq("email", parsed.data.targetEmail).maybeSingle();
    if (!s) return NextResponse.json({ error: "student not found" }, { status: 404 });
    studentId = s.id;
  }

  const rows = parsed.data.ids.map((mid) => ({
    module_id: mid,
    scope: studentId ? ("student" as const) : ("cohort" as const),
    student_id: studentId ?? undefined,
    granted_by: admin.id,
  }));
  const { error } = await supabase.from("module_access").insert(rows);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
