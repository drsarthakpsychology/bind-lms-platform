import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { ApiFail } from "@/lib/app-api/respond";
import { decisionSchema, isUuid } from "@/lib/clinic/schemas";
import { decideLeave } from "@/lib/clinic/admin";
import type { ClinicLeaveRequest } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** POST /api/app/v1/clinic/admin/leave/:id { decision, note? }: approve or reject (the student is told). */
export const POST = appRoute<{ id: string }>({ auth: "superAdmin", sandbox: true }, async ({ user, params, body, limitWrite }): Promise<ClinicLeaveRequest> => {
  if (!isUuid(params.id)) throw new ApiFail("not_found");
  const b = await body(decisionSchema, 2048);
  await limitWrite(`app:clinic-admin:${user.profile.id}`, 120);
  return decideLeave(clinicDb(), params.id, b, user.profile.id, Date.now());
});
