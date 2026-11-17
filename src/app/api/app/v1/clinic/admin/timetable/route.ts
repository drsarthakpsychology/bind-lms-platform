import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { idOrNull, slotSchema } from "@/lib/clinic/schemas";
import { createSlot, listSlots } from "@/lib/clinic/admin";
import type { ClinicSlot } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/clinic/admin/timetable?cohort=: the weekly timetable. */
export const GET = appRoute({ auth: "admin" }, async ({ query }): Promise<{ slots: ClinicSlot[] }> => listSlots(clinicDb(), idOrNull(query.get("cohort"))));

/** POST /api/app/v1/clinic/admin/timetable: add a weekly slot. */
export const POST = appRoute({ auth: "superAdmin", sandbox: true }, async ({ user, body, limitWrite }): Promise<ClinicSlot> => {
  const b = await body(slotSchema, 8192);
  await limitWrite(`app:clinic-admin:${user.profile.id}`, 120);
  return createSlot(clinicDb(), b, user.profile.id);
});
