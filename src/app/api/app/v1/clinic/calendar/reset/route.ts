import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { resetCalendarLink } from "@/lib/clinic/calendar";
import type { ClinicCalendarLink } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** POST /api/app/v1/clinic/calendar/reset: a new link; the old one stops working. */
export const POST = appRoute({ auth: "bearer" }, async ({ user, limitWrite }): Promise<ClinicCalendarLink> => {
  await limitWrite(`app:clinic-cal:${user.profile.id}`, 30);
  return resetCalendarLink(clinicDb(), user.profile.id);
});
