import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { ApiFail } from "@/lib/app-api/respond";
import { isUuid } from "@/lib/clinic/schemas";
import { cancelLeave } from "@/lib/clinic/student";

export const runtime = "nodejs";

/** DELETE /api/app/v1/clinic/leave/:id: cancel my request while it is still waiting. */
export const DELETE = appRoute<{ id: string }>({ auth: "bearer" }, async ({ user, params, limitWrite }) => {
  if (!isUuid(params.id)) throw new ApiFail("not_found");
  await limitWrite(`app:clinic:${user.profile.id}`, 30);
  return cancelLeave(clinicDb(), user.profile.id, params.id);
});
