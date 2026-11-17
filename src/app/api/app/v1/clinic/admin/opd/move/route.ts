import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { moveSchema } from "@/lib/clinic/schemas";
import { moveAssignment } from "@/lib/clinic/admin";
import type { ClinicPlan } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** POST /api/app/v1/clinic/admin/opd/move { assignmentId, date, batch, force? }: move one visit. */
export const POST = appRoute({ auth: "superAdmin", sandbox: true }, async ({ user, body, limitWrite }): Promise<ClinicPlan> => {
  const b = await body(moveSchema, 1024);
  await limitWrite(`app:clinic-admin:${user.profile.id}`, 120);
  return moveAssignment(clinicDb(), b, user.profile.id, Date.now());
});
