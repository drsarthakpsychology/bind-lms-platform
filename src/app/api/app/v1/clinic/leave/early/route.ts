import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { earlyLeaveSchema } from "@/lib/clinic/schemas";
import { requestEarlyLeave } from "@/lib/clinic/student";
import type { ClinicLeaveRequest } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** POST /api/app/v1/clinic/leave/early { sessionId, leaveAt, reason }: leave a session early (uses no leave). */
export const POST = appRoute({ auth: "bearer" }, async ({ user, body, limitWrite }): Promise<ClinicLeaveRequest> => {
  const b = await body(earlyLeaveSchema, 4096);
  await limitWrite(`app:clinic:${user.profile.id}`, 30);
  return requestEarlyLeave(clinicDb(), user.profile.id, b, Date.now());
});
