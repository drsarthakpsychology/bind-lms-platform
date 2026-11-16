import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { batchSchema } from "@/lib/clinic/schemas";
import { chooseBatch } from "@/lib/clinic/student";
import type { ClinicMyOpd } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** PUT /api/app/v1/clinic/opd/batch { batch }: pick morning or evening (once; then the admin changes it). */
export const PUT = appRoute({ auth: "bearer" }, async ({ user, body, limitWrite }): Promise<ClinicMyOpd> => {
  const b = await body(batchSchema, 1024);
  await limitWrite(`app:clinic:${user.profile.id}`, 30);
  return chooseBatch(clinicDb(), user.profile.id, b.batch, b.cohortId, Date.now());
});
