import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { isSuperAdmin } from "@/lib/auth/guards";
import { idOrNull } from "@/lib/clinic/schemas";
import { overview } from "@/lib/clinic/admin";
import type { ClinicAdminOverview } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/clinic/admin/overview?cohort=: cohorts, today's sessions with counts, waiting leave, logs due. */
export const GET = appRoute({ auth: "admin" }, async ({ user, query }): Promise<ClinicAdminOverview> => overview(clinicDb(), idOrNull(query.get("cohort")), isSuperAdmin(user.profile), Date.now()));
