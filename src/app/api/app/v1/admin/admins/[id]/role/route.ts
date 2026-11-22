import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { audit } from "@/lib/auth/audit";
import { listAdminPeople } from "@/lib/app-api/admin-r2b";
import { roleChangeProblem, roleUpdate, ROLE_TARGETS, type RoleTarget } from "@/lib/app-api/admin-r2b-rules";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import { uuid } from "@/lib/app-api/schemas";

export const runtime = "nodejs";

const schema = z.object({ role: z.enum(ROLE_TARGETS as [RoleTarget, ...RoleTarget[]]), confirmSelf: z.boolean().optional() });

/**
 * POST /api/app/v1/admin/admins/:id/role: make an admin a Super Admin or
 * view-only, or take admin rights away (back to student, or no access at
 * all: the account stays, sign-in is blocked). Super Admin only. Never the
 * last Super Admin; your own rights need `confirmSelf`. Logged in the admin
 * audit log.
 */
export const POST = appRoute<{ id: string }>({ auth: "superAdmin" }, async ({ user, params, body, limitWrite }): Promise<{ id: string; role: RoleTarget }> => {
  if (!uuid.safeParse(params.id).success) throw new ApiFail("not_found");
  const { role, confirmSelf } = await body(schema, 1024);
  await limitWrite(`app:admin-role:${user.profile.id}`, 20);
  const admin = createAdminClient();
  const people = await listAdminPeople(admin);
  const problem = roleChangeProblem(people, user.profile.id, params.id, role, confirmSelf === true);
  if (problem) throw new ApiFail(problem.code, problem.message, problem.needsConfirm ? { needsConfirm: true } : undefined);
  const before = people.find((p) => p.id === params.id)!;
  const { error } = await admin.from("profiles").update(roleUpdate(role)).eq("id", params.id).in("role", ["admin", "view_admin"]);
  if (error) throw new ApiFail("server_error", "Could not change their rights. Try again.");
  await audit(admin, { action: role === "admin" || role === "view_admin" ? "admin.role_set" : "admin.rights_removed", targetType: "profile", targetId: params.id, details: { email: before.email, from: before.role, to: role, via: "app" }, actor: { id: user.profile.id, email: user.profile.email ?? null } });
  revalidatePath("/admin/management");
  return { id: params.id, role };
});
