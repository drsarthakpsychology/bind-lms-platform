import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { cohortBodySchema } from "@/lib/clinic/schemas";
import { generate } from "@/lib/clinic/admin";
import type { ClinicPlan } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** POST /api/app/v1/clinic/admin/opd/generate { cohortId }: a draft from today on (published days kept). */
export const POST = appRoute({ auth: "superAdmin", sandbox: true }, async ({ user, body, limitWrite }): Promise<ClinicPlan> => {
  const b = await body(cohortBodySchema, 1024);
  await limitWrite(`app:clinic-generate:${user.profile.id}`, 10);
  return generate(clinicDb(), b.cohortId, user.profile.id, Date.now());
});
