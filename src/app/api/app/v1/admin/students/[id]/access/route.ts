import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { setFeatureFor, setScopeFor } from "@/app/(dashboard)/admin/access/actions";
import { accessSections, studentAccess, type StudentAccess } from "@/lib/app-api/admin-r2b";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import { uuid } from "@/lib/app-api/schemas";

export const runtime = "nodejs";

/** GET /api/app/v1/admin/students/:id/access: full or lectures only, and which sections are open for this one student. */
export const GET = appRoute<{ id: string }>({ auth: "admin" }, async ({ params }): Promise<StudentAccess> => {
  if (!uuid.safeParse(params.id).success) throw new ApiFail("not_found");
  const r = await studentAccess(createAdminClient(), params.id);
  if (!r) throw new ApiFail("not_found");
  return r;
});

const schema = z.union([z.object({ section: z.string().min(1).max(64), open: z.boolean() }), z.object({ scope: z.enum(["full", "lectures_only"]) })]);

/** POST /api/app/v1/admin/students/:id/access: open or close one section, or set full / lectures only (the website's setFeatureFor and setScopeFor). Super Admin only. */
export const POST = appRoute<{ id: string }>({ auth: "superAdmin" }, async ({ user, params, body, limitWrite }): Promise<StudentAccess> => {
  if (!uuid.safeParse(params.id).success) throw new ApiFail("not_found");
  const b = await body(schema, 1024);
  await limitWrite(`app:access:${user.profile.id}`, 60);
  const admin = createAdminClient();
  if (!(await studentAccess(admin, params.id))) throw new ApiFail("not_found");
  if ("section" in b) {
    if (!(await accessSections()).some((s) => s.key === b.section)) throw new ApiFail("bad_request", "That section cannot be switched.");
    const r = await setFeatureFor([params.id], b.section, !b.open);
    if (r.error) throw new ApiFail("server_error", r.error);
  } else {
    const r = await setScopeFor([params.id], b.scope);
    if (r.error) throw new ApiFail("server_error", r.error);
  }
  return (await studentAccess(admin, params.id))!;
});
