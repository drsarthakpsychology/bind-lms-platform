import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { setFeatureFor, setScopeFor } from "@/app/(dashboard)/admin/access/actions";
import { setAccountStatus } from "@/app/(dashboard)/admin/students/actions";
import { accessSections, type AccessSection } from "@/lib/app-api/admin-r2b";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";

export const runtime = "nodejs";

/** GET /api/app/v1/admin/access: the sections an admin can open or close for students. */
export const GET = appRoute({ auth: "admin" }, async (): Promise<{ v: 1; sections: AccessSection[] }> => ({ v: 1, sections: await accessSections() }));

const schema = z
  .object({
    ids: z.array(z.string().uuid()).min(1).max(2000).optional(),
    cohortId: z.string().uuid().optional(),
    scope: z.enum(["full", "lectures_only"]).optional(),
    /** Section key: true to open, false to close. Only the ones named change. */
    sections: z.record(z.string().max(64), z.boolean()).optional(),
    account: z.enum(["pause", "resume"]).optional(),
  })
  .refine((b) => Boolean(b.ids?.length) !== Boolean(b.cohortId), { message: "Pick a cohort or some students." })
  .refine((b) => b.scope || (b.sections && Object.keys(b.sections).length) || b.account, { message: "Pick what to change." });

/**
 * POST /api/app/v1/admin/access: change access for many students at once,
 * a cohort or picked students: full or lectures only, sections opened or
 * closed, or pause / resume sign-in. Only students are touched. Super Admin only.
 */
export const POST = appRoute({ auth: "superAdmin" }, async ({ user, body, limitWrite }): Promise<{ students: number }> => {
  const b = await body(schema, 96 * 1024);
  await limitWrite(`app:bulk-access:${user.profile.id}`, 10);
  const admin = createAdminClient();
  let ids = b.ids ?? [];
  if (b.cohortId) {
    const { data } = await admin.from("cohort_members").select("user_id").eq("cohort_id", b.cohortId);
    ids = (data ?? []).map((m) => String(m.user_id));
  }
  const { data: students } = ids.length ? await admin.from("profiles").select("id").in("id", ids).eq("role", "student") : { data: [] as { id: string }[] };
  ids = (students ?? []).map((s) => String(s.id));
  if (!ids.length) throw new ApiFail("bad_request", "No students to change.");
  const allowed = new Set((await accessSections()).map((s) => s.key));
  for (const k of Object.keys(b.sections ?? {})) if (!allowed.has(k)) throw new ApiFail("bad_request", "That section cannot be switched.");
  if (b.scope) {
    const r = await setScopeFor(ids, b.scope);
    if (r.error) throw new ApiFail("server_error", r.error);
  }
  for (const [k, open] of Object.entries(b.sections ?? {})) {
    const r = await setFeatureFor(ids, k, !open);
    if (r.error) throw new ApiFail("server_error", r.error);
  }
  if (b.account) {
    for (const id of ids) {
      const r = await setAccountStatus(id, b.account === "pause" ? "blocked" : "active", b.account === "pause" ? "Paused from the app" : undefined);
      if (r.error) throw new ApiFail("server_error", r.error);
    }
  }
  return { students: ids.length };
});
