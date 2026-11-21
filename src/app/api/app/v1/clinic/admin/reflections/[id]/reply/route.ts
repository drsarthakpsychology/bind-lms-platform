import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { ApiFail } from "@/lib/app-api/respond";
import { isUuid, replySchema } from "@/lib/clinic/schemas";
import { replyReflection } from "@/lib/clinic/reflections";
import type { ClinicAdminReflection } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** POST /api/app/v1/clinic/admin/reflections/:id/reply { reply }: the supervisor's reply (the student is told). */
export const POST = appRoute<{ id: string }>({ auth: "superAdmin" }, async ({ user, params, body, limitWrite }): Promise<ClinicAdminReflection> => {
  if (!isUuid(params.id)) throw new ApiFail("not_found");
  const b = await body(replySchema, 4096);
  await limitWrite(`app:clinic-admin:${user.profile.id}`, 120);
  return replyReflection(clinicDb(), params.id, b, user.profile.id, Date.now());
});
