import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { publishSchema } from "@/lib/clinic/schemas";
import { publishPlan } from "@/lib/clinic/admin";
import type { ClinicPublishResult } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** POST /api/app/v1/clinic/admin/opd/publish { cohortId, notify? }: the draft becomes the students' OPD days. */
export const POST = appRoute({ auth: "superAdmin", sandbox: true }, async ({ user, body, limitWrite }): Promise<ClinicPublishResult> => {
  const b = await body(publishSchema, 1024);
  await limitWrite(`app:clinic-admin:${user.profile.id}`, 120);
  return publishPlan(clinicDb(), b, user.profile.id, Date.now());
});
