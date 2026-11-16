import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { idOrNull } from "@/lib/clinic/schemas";
import { getMyAttendance } from "@/lib/clinic/student";
import type { ClinicMyAttendance } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/clinic/attendance: my sessions so far and my percentage. */
export const GET = appRoute({ auth: "bearer" }, async ({ user, query }): Promise<ClinicMyAttendance> => getMyAttendance(clinicDb(), user.profile.id, idOrNull(query.get("cohort")), Date.now()));
