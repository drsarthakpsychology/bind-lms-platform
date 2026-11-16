import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { scanSchema } from "@/lib/clinic/schemas";
import { scan } from "@/lib/clinic/student";
import type { ClinicScanResult } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** POST /api/app/v1/clinic/scan { token | code, direction? }: scan in or out. */
export const POST = appRoute({ auth: "bearer" }, async ({ user, body, limitWrite }): Promise<ClinicScanResult> => {
  const b = await body(scanSchema, 2048);
  await limitWrite(`app:clinic-scan:${user.profile.id}`, 12);
  return scan(clinicDb(), user.profile.id, b, Date.now());
});
