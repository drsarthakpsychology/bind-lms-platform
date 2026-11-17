import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { ApiFail } from "@/lib/app-api/respond";
import { isUuid, manualMarkSchema } from "@/lib/clinic/schemas";
import { liveAttendance, manualMark } from "@/lib/clinic/admin";
import type { ClinicLiveAttendance } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/clinic/admin/sessions/:id/attendance: who is in, out, late, missing, on leave. */
export const GET = appRoute<{ id: string }>({ auth: "admin" }, async ({ params }): Promise<ClinicLiveAttendance> => {
  if (!isUuid(params.id)) throw new ApiFail("not_found");
  return liveAttendance(clinicDb(), params.id, Date.now());
});

/** POST /api/app/v1/clinic/admin/sessions/:id/attendance { userId, direction, at?, note? }: mark by hand. */
export const POST = appRoute<{ id: string }>({ auth: "superAdmin", sandbox: true }, async ({ user, params, body, limitWrite }): Promise<ClinicLiveAttendance> => {
  if (!isUuid(params.id)) throw new ApiFail("not_found");
  const b = await body(manualMarkSchema, 2048);
  await limitWrite(`app:clinic-admin:${user.profile.id}`, 120);
  return manualMark(clinicDb(), params.id, b, user.profile.id, Date.now());
});
