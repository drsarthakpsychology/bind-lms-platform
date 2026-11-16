import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { isSuperAdmin } from "@/lib/auth/guards";
import { ApiFail } from "@/lib/app-api/respond";
import { isUuid } from "@/lib/clinic/schemas";
import { showSessionCode } from "@/lib/clinic/admin";
import type { ClinicShowCode } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/clinic/admin/sessions/:id/code: the QR and 6-character code for this 30-second window. */
export const GET = appRoute<{ id: string }>({ auth: "admin" }, async ({ user, params, limitFast }): Promise<ClinicShowCode> => {
  if (!isUuid(params.id)) throw new ApiFail("not_found");
  limitFast(`app:clinic-code:${user.profile.id}`, 30);
  return showSessionCode(clinicDb(), params.id, user.profile.id, isSuperAdmin(user.profile), Date.now());
});
