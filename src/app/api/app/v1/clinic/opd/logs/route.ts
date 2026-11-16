import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { caseLogSchema } from "@/lib/clinic/schemas";
import { submitCaseLog } from "@/lib/clinic/student";
import type { ClinicVisit } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** POST /api/app/v1/clinic/opd/logs { assignmentId, cases, absent?, note? }: the day's case log. */
export const POST = appRoute({ auth: "bearer" }, async ({ user, body, limitWrite }): Promise<ClinicVisit> => {
  const b = await body(caseLogSchema, 2048);
  await limitWrite(`app:clinic:${user.profile.id}`, 30);
  return submitCaseLog(clinicDb(), user.profile.id, b, Date.now());
});
