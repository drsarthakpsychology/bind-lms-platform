import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { dayNoteSchema } from "@/lib/clinic/schemas";
import { setDayNote } from "@/lib/clinic/admin";

export const runtime = "nodejs";

/** PUT /api/app/v1/clinic/admin/notes { cohortId, date, note }: the day's note (empty removes it). */
export const PUT = appRoute({ auth: "superAdmin", sandbox: true }, async ({ user, body, limitWrite }) => {
  const b = await body(dayNoteSchema, 4096);
  await limitWrite(`app:clinic-admin:${user.profile.id}`, 120);
  return setDayNote(clinicDb(), b, user.profile.id, Date.now());
});
