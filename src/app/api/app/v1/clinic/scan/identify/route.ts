import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { scanIdentifySchema } from "@/lib/clinic/schemas";
import { identify } from "@/lib/clinic/scan-flow";
import type { ClinicScanIdentify } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** POST /api/app/v1/clinic/scan/identify { token | code }: which session this is and where the student stands. Saves nothing. */
export const POST = appRoute({ auth: "bearer" }, async ({ user, body, limitWrite }): Promise<ClinicScanIdentify> => {
  const b = await body(scanIdentifySchema, 2048);
  await limitWrite(`app:clinic-scan:${user.profile.id}`, 12);
  return identify(clinicDb(), user.profile.id, b, Date.now());
});
