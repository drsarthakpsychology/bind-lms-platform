import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { idOrNull, settingsSchema } from "@/lib/clinic/schemas";
import { getSettings, saveSettings } from "@/lib/clinic/admin";
import type { ClinicOpdSettings } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/clinic/admin/opd/settings?cohort= */
export const GET = appRoute({ auth: "admin" }, async ({ query }): Promise<ClinicOpdSettings> => getSettings(clinicDb(), idOrNull(query.get("cohort"))));

/** PUT /api/app/v1/clinic/admin/opd/settings: seats per weekday x batch, cases per visit, dates, late minutes, holidays. */
export const PUT = appRoute({ auth: "superAdmin", sandbox: true }, async ({ user, body, limitWrite }): Promise<ClinicOpdSettings> => {
  const b = await body(settingsSchema, 32 * 1024);
  await limitWrite(`app:clinic-admin:${user.profile.id}`, 120);
  return saveSettings(clinicDb(), b, user.profile.id, Date.now());
});
