import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { ApiFail } from "@/lib/app-api/respond";
import { isUuid, slotSchema } from "@/lib/clinic/schemas";
import { deleteSlot, updateSlot } from "@/lib/clinic/admin";
import type { ClinicSlot } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** PUT /api/app/v1/clinic/admin/timetable/:id: change a weekly slot (sessions already made stay). */
export const PUT = appRoute<{ id: string }>({ auth: "superAdmin", sandbox: true }, async ({ user, params, body, limitWrite }): Promise<ClinicSlot> => {
  if (!isUuid(params.id)) throw new ApiFail("not_found");
  const b = await body(slotSchema, 8192);
  await limitWrite(`app:clinic-admin:${user.profile.id}`, 120);
  return updateSlot(clinicDb(), params.id, b, Date.now());
});

/** DELETE /api/app/v1/clinic/admin/timetable/:id */
export const DELETE = appRoute<{ id: string }>({ auth: "superAdmin", sandbox: true }, async ({ user, params, limitWrite }) => {
  if (!isUuid(params.id)) throw new ApiFail("not_found");
  await limitWrite(`app:clinic-admin:${user.profile.id}`, 120);
  return deleteSlot(clinicDb(), params.id);
});
