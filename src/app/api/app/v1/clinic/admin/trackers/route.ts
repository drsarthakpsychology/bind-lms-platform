import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { idOrNull } from "@/lib/clinic/schemas";
import { trackers } from "@/lib/clinic/admin";
import type { ClinicTrackers } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/clinic/admin/trackers?cohort=: attendance, leave and cases for every student. */
export const GET = appRoute({ auth: "admin" }, async ({ query }): Promise<ClinicTrackers> => trackers(clinicDb(), idOrNull(query.get("cohort")), Date.now()));
