import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { cohortBodySchema } from "@/lib/clinic/schemas";
import { remindLogs } from "@/lib/clinic/admin";
import type { ClinicRemindResult } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** POST /api/app/v1/clinic/admin/opd/remind { cohortId }: a notice to everyone with a case log due. */
export const POST = appRoute({ auth: "superAdmin" }, async ({ user, body, limitWrite }): Promise<ClinicRemindResult> => {
  const b = await body(cohortBodySchema, 1024);
  await limitWrite(`app:clinic-remind:${user.profile.id}`, 6);
  return remindLogs(clinicDb(), b.cohortId, user.profile.id, Date.now());
});
