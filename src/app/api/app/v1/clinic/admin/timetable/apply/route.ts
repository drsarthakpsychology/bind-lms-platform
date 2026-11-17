import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { applySchema } from "@/lib/clinic/schemas";
import { applyTimetable } from "@/lib/clinic/admin";
import type { ClinicApplyResult } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** POST /api/app/v1/clinic/admin/timetable/apply { cohortId, from, to }: make the sessions (adds only what is missing). */
export const POST = appRoute({ auth: "superAdmin", sandbox: true }, async ({ user, body, limitWrite }): Promise<ClinicApplyResult> => {
  const b = await body(applySchema, 1024);
  await limitWrite(`app:clinic-admin:${user.profile.id}`, 120);
  return applyTimetable(clinicDb(), b, user.profile.id);
});
