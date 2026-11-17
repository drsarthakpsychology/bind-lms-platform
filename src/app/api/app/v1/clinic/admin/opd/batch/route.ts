import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { adminBatchSchema } from "@/lib/clinic/schemas";
import { setBatch } from "@/lib/clinic/admin";

export const runtime = "nodejs";

/** PUT /api/app/v1/clinic/admin/opd/batch { cohortId, userId, batch }: change a student's batch. */
export const PUT = appRoute({ auth: "superAdmin", sandbox: true }, async ({ user, body, limitWrite }) => {
  const b = await body(adminBatchSchema, 1024);
  await limitWrite(`app:clinic-admin:${user.profile.id}`, 120);
  return setBatch(clinicDb(), b, user.profile.id, Date.now());
});
