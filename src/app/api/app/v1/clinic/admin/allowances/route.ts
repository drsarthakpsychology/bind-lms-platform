import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { allowanceSchema, idOrNull } from "@/lib/clinic/schemas";
import { listAllowances, setAllowances } from "@/lib/clinic/admin";
import type { ClinicAllowanceResult, ClinicAllowances } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/clinic/admin/allowances?cohort=: every student's leaves and the change log. */
export const GET = appRoute({ auth: "admin" }, async ({ query }): Promise<ClinicAllowances> => listAllowances(clinicDb(), idOrNull(query.get("cohort")), Date.now()));

/** PUT /api/app/v1/clinic/admin/allowances { cohortId, userIds?, set | add, note? }: bulk or one by one. */
export const PUT = appRoute({ auth: "superAdmin" }, async ({ user, body, limitWrite }): Promise<ClinicAllowanceResult> => {
  const b = await body(allowanceSchema, 128 * 1024);
  await limitWrite(`app:clinic-admin:${user.profile.id}`, 120);
  return setAllowances(clinicDb(), b, user.profile.id, Date.now());
});
