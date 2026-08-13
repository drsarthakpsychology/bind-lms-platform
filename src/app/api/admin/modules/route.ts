import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const schema = z.object({
  action: z.enum(["publish", "schedule", "unpublish", "grant_cohort", "revoke"]),
  ids: z.array(z.string().uuid()).min(1),
  targetEmail: z.string().email().optional(),
  targetStudentId: z.string().uuid().optional(),
  revokeScope: z.enum(["cohort", "student"]).optional(),
});

/**
 * POST /api/admin/modules — bulk module actions. Admin-only.
 * publish/schedule/unpublish flip module state.
 * grant_cohort grants access to the whole cohort (scope='cohort') or a single
 * student (scope='student').
 * revoke removes module_access rows — either a cohort-wide grant (scope='cohort')
 * or a single student's grant (scope='student').
 */
export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const supabase = createAdminClient();
  const d = parsed.data;

  // publish / schedule / unpublish — flip module state.
  if (d.action === "publish" || d.action === "schedule" || d.action === "unpublish") {
    const state = d.action === "publish" ? "published" : d.action === "schedule" ? "scheduled" : "archived";
    const update: { state: string; release_at?: string } = { state };
    if (state === "scheduled") {
      update.release_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // +7 days default
    }
    const { error } = await supabase.from("modules").update(update).in("id", d.ids);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  // grant_cohort — grant to the cohort (scope='cohort') or one student (scope='student').
  if (d.action === "grant_cohort") {
    let studentId = d.targetStudentId ?? null;
    if (!studentId && d.targetEmail) {
      const { data: s } = await supabase.from("profiles").select("id").eq("email", d.targetEmail).maybeSingle();
      if (!s) return NextResponse.json({ error: "student not found" }, { status: 404 });
      studentId = s.id;
    }

    const rows = d.ids.map((mid) => ({
      module_id: mid,
      scope: studentId ? ("student" as const) : ("cohort" as const),
      student_id: studentId ?? undefined,
      granted_by: admin.id,
    }));
    const { error } = await supabase.from("module_access").insert(rows);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  // revoke — remove access. Cohort revoke deletes every cohort-scoped row for
  // the modules; student revoke deletes one student's individual grants.
  if (d.action === "revoke") {
    if (d.revokeScope === "cohort") {
      const { error } = await supabase
        .from("module_access")
        .delete()
        .in("module_id", d.ids)
        .eq("scope", "cohort");
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true });
    }

    let studentId = d.targetStudentId ?? null;
    if (!studentId && d.targetEmail) {
      const { data: s } = await supabase.from("profiles").select("id").eq("email", d.targetEmail).maybeSingle();
      if (!s) return NextResponse.json({ error: "student not found" }, { status: 404 });
      studentId = s.id;
    }
    if (!studentId) return NextResponse.json({ error: "student not found" }, { status: 404 });

    const { error } = await supabase
      .from("module_access")
      .delete()
      .in("module_id", d.ids)
      .eq("scope", "student")
      .eq("student_id", studentId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}
