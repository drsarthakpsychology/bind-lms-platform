import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { idOrNull } from "@/lib/clinic/schemas";
import { getWeek } from "@/lib/clinic/student";
import type { ClinicWeek } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/clinic/week?start=YYYY-MM-DD: seven days from start (default this Monday). */
export const GET = appRoute({ auth: "bearer" }, async ({ user, query }): Promise<ClinicWeek> => getWeek(clinicDb(), user.profile.id, idOrNull(query.get("cohort")), query.get("start"), Date.now()));
