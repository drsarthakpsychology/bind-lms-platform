import { resolveWallReport } from "@/lib/app-api/wall-reports";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import { uuid } from "@/lib/app-api/schemas";

export const runtime = "nodejs";

/** POST /api/app/v1/admin/wall-reports/:id/resolve: close one report; the post stays on the wall (super admin only). */
export const POST = appRoute<{ id: string }>({ auth: "superAdmin" }, async ({ user, params, limitWrite }): Promise<{ resolved: true }> => {
  if (!uuid.safeParse(params.id).success) throw new ApiFail("not_found");
  await limitWrite(`app:wallreport:${user.profile.id}`, 60);
  if (!(await resolveWallReport(params.id))) throw new ApiFail("server_error", "Could not resolve.");
  return { resolved: true };
});
