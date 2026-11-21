import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { getCalendarLink } from "@/lib/clinic/calendar";
import type { ClinicCalendarLink } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/clinic/calendar: my private calendar link (made the first time). */
export const GET = appRoute({ auth: "bearer" }, async ({ user, limitWrite }): Promise<ClinicCalendarLink> => {
  await limitWrite(`app:clinic-cal:${user.profile.id}`, 30);
  return getCalendarLink(clinicDb(), user.profile.id);
});
