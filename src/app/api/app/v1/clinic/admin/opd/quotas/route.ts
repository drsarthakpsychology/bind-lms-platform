import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { idOrNull, quotaSchema } from "@/lib/clinic/schemas";
import { listQuotas, setQuotas } from "@/lib/clinic/admin";
import type { ClinicQuotas } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/clinic/admin/opd/quotas?cohort=: each student's cases (base, extras, done, pending). */
export const GET = appRoute({ auth: "admin" }, async ({ query }): Promise<ClinicQuotas> => listQuotas(clinicDb(), idOrNull(query.get("cohort")), Date.now()));

/** PUT /api/app/v1/clinic/admin/opd/quotas { cohortId, userIds?, base }: base cases, whole cohort or listed students. */
export const PUT = appRoute({ auth: "superAdmin" }, async ({ user, body, limitWrite }) => {
  const b = await body(quotaSchema, 128 * 1024);
  await limitWrite(`app:clinic-admin:${user.profile.id}`, 120);
  return setQuotas(clinicDb(), b, user.profile.id, Date.now());
});
