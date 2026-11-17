import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { extraSchema } from "@/lib/clinic/schemas";
import { addExtra } from "@/lib/clinic/admin";
import type { ClinicQuotaRow } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** POST /api/app/v1/clinic/admin/opd/extras { cohortId, userId, count, note? }: add paid extra cases. */
export const POST = appRoute({ auth: "superAdmin", sandbox: true }, async ({ user, body, limitWrite }): Promise<ClinicQuotaRow> => {
  const b = await body(extraSchema, 2048);
  await limitWrite(`app:clinic-admin:${user.profile.id}`, 120);
  return addExtra(clinicDb(), b, user.profile.id, Date.now());
});
