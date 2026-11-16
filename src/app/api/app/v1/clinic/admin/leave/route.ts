import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { idOrNull } from "@/lib/clinic/schemas";
import { leaveQueue } from "@/lib/clinic/admin";
import type { ClinicLeaveQueue } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/clinic/admin/leave?cohort=&status=: the leave queue (waiting first, oldest first). */
export const GET = appRoute({ auth: "admin" }, async ({ query }): Promise<ClinicLeaveQueue> => leaveQueue(clinicDb(), idOrNull(query.get("cohort")), query.get("status"), Date.now()));
