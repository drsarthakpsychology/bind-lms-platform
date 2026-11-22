import { createAdminClient } from "@/lib/supabase/server";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import { uuid } from "@/lib/app-api/schemas";

export const runtime = "nodejs";

/** POST /api/app/v1/admin/wall-reports/:id/close: close a report (the website's resolve). The post stays on the wall. Super Admin only. */
export const POST = appRoute<{ id: string }>({ auth: "superAdmin" }, async ({ user, params, limitWrite }): Promise<{ closed: true }> => {
  if (!uuid.safeParse(params.id).success) throw new ApiFail("not_found");
  await limitWrite(`app:wall-close:${user.profile.id}`, 60);
  const { data, error } = await createAdminClient().from("wall_reports").update({ status: "resolved" }).eq("id", params.id).select("id");
  if (error) throw new ApiFail("server_error", "Could not close it. Try again.");
  if (!data?.length) throw new ApiFail("not_found");
  return { closed: true };
});
