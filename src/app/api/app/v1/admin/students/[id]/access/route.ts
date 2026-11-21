import { z } from "zod";
import { setFeatureFor, setScopeFor } from "@/app/(dashboard)/admin/access/actions";
import { FEATURES } from "@/lib/access/features";
import { isSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import { uuid } from "@/lib/app-api/schemas";
import type { AdminStudentAccess } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** One student's access as the website's Access tab shows it: Full or Lectures only, and every section that can be switched off. */
async function readAccess(id: string, canWrite: boolean): Promise<AdminStudentAccess> {
  const admin = createAdminClient();
  const [{ data: p }, blocks] = await Promise.all([
    admin.from("profiles").select("id, role, scope").eq("id", id).maybeSingle(),
    admin.from("access_blocks").select("feature").eq("user_id", id).limit(200),
  ]);
  if (!p || p.role !== "student") throw new ApiFail("not_found");
  const off = new Set((blocks.data ?? []).map((r) => String(r.feature)));
  return {
    v: 1,
    scope: p.scope === "lectures_only" ? "lectures_only" : "full",
    ready: !blocks.error,
    canWrite,
    sections: FEATURES.map((f) => ({ key: f.key, label: f.label, group: f.group, off: off.has(f.key) })),
  };
}

/** GET /api/app/v1/admin/students/:id/access */
export const GET = appRoute<{ id: string }>({ auth: "admin" }, async ({ user, params }): Promise<AdminStudentAccess> => {
  if (!uuid.safeParse(params.id).success) throw new ApiFail("not_found");
  return readAccess(params.id, isSuperAdmin(user.profile));
});

const schema = z.union([z.object({ scope: z.enum(["full", "lectures_only"]) }), z.object({ feature: z.string().min(1).max(80), off: z.boolean() })]);

/** PUT /api/app/v1/admin/students/:id/access  { scope } or { feature, off }: the website's setScopeFor and setFeatureFor (super admin only). Answers the new state. */
export const PUT = appRoute<{ id: string }>({ auth: "superAdmin" }, async ({ user, params, body, limitWrite }): Promise<AdminStudentAccess> => {
  if (!uuid.safeParse(params.id).success) throw new ApiFail("not_found");
  const b = await body(schema, 1024);
  await limitWrite(`app:access:${user.profile.id}`, 60);
  const r = "scope" in b ? await setScopeFor([params.id], b.scope) : await setFeatureFor([params.id], b.feature, b.off);
  if (r.error) throw new ApiFail(r.error === "Not authorized." ? "forbidden" : r.error === "Unknown section." ? "bad_request" : "server_error", r.error);
  return readAccess(params.id, true);
});
