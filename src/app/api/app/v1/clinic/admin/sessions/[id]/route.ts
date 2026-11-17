import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { ApiFail } from "@/lib/app-api/respond";
import { isUuid, sessionPatchSchema } from "@/lib/clinic/schemas";
import { patchSession } from "@/lib/clinic/admin";
import type { ClinicSession } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** PATCH /api/app/v1/clinic/admin/sessions/:id: move, edit, cancel or restore, note. */
export const PATCH = appRoute<{ id: string }>({ auth: "superAdmin", sandbox: true }, async ({ user, params, body, limitWrite }): Promise<ClinicSession> => {
  if (!isUuid(params.id)) throw new ApiFail("not_found");
  const b = await body(sessionPatchSchema, 8192);
  await limitWrite(`app:clinic-admin:${user.profile.id}`, 120);
  return patchSession(clinicDb(), params.id, b, user.profile.id, Date.now());
});
