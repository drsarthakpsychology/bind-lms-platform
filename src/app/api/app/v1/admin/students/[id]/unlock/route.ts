import { setAccountStatus } from "@/app/(dashboard)/admin/students/actions";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import { uuid } from "@/lib/app-api/schemas";
import type { LockResult } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** POST /api/app/v1/admin/students/:id/unlock (super admin only). */
export const POST = appRoute<{ id: string }>({ auth: "superAdmin" }, async ({ user, params, limitWrite }): Promise<LockResult> => {
  if (!uuid.safeParse(params.id).success) throw new ApiFail("not_found");
  await limitWrite(`app:lock:${user.profile.id}`, 60);
  const r = await setAccountStatus(params.id, "active");
  if (r.error) throw new ApiFail(r.error === "Not authorized." ? "forbidden" : "server_error", r.error);
  return { blocked: false };
});
