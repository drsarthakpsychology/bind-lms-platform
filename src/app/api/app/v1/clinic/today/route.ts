import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { idOrNull } from "@/lib/clinic/schemas";
import { getToday } from "@/lib/clinic/student";
import type { ClinicToday } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/clinic/today: today's sessions, my OPD day, leaves left, logs due. */
export const GET = appRoute({ auth: "bearer" }, async ({ user, query }): Promise<ClinicToday> => getToday(clinicDb(), user.profile.id, idOrNull(query.get("cohort")), Date.now()));
