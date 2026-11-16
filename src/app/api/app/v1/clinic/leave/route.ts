import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { idOrNull, leaveSchema } from "@/lib/clinic/schemas";
import { getMyLeave, requestLeave } from "@/lib/clinic/student";
import type { ClinicLeaveRequest, ClinicMyLeave } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/clinic/leave: leaves left and my requests. */
export const GET = appRoute({ auth: "bearer" }, async ({ user, query }): Promise<ClinicMyLeave> => getMyLeave(clinicDb(), user.profile.id, idOrNull(query.get("cohort")), Date.now()));

/** POST /api/app/v1/clinic/leave { sessionIds, reason }: ask for leave (over the limit is allowed and flagged). */
export const POST = appRoute({ auth: "bearer" }, async ({ user, body, limitWrite }): Promise<ClinicLeaveRequest> => {
  const b = await body(leaveSchema, 8192);
  await limitWrite(`app:clinic:${user.profile.id}`, 30);
  return requestLeave(clinicDb(), user.profile.id, b, Date.now());
});
