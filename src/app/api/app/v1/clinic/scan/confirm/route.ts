import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { scanConfirmSchema } from "@/lib/clinic/schemas";
import { confirm } from "@/lib/clinic/scan-flow";
import type { ClinicScanConfirm } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** POST /api/app/v1/clinic/scan/confirm { ticket, direction, attemptId }: save IN or OUT, once. */
export const POST = appRoute({ auth: "bearer" }, async ({ user, body, limitWrite }): Promise<ClinicScanConfirm> => {
  const b = await body(scanConfirmSchema, 2048);
  await limitWrite(`app:clinic-scan-confirm:${user.profile.id}`, 20);
  return confirm(clinicDb(), user.profile.id, b, Date.now());
});
