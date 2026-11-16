import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { idOrNull } from "@/lib/clinic/schemas";
import { getMyOpd } from "@/lib/clinic/student";
import type { ClinicMyOpd } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/clinic/opd: my batch, case quota and OPD days. */
export const GET = appRoute({ auth: "bearer" }, async ({ user, query }): Promise<ClinicMyOpd> => getMyOpd(clinicDb(), user.profile.id, idOrNull(query.get("cohort")), Date.now()));
