import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { isSuperAdmin } from "@/lib/auth/guards";
import { idOrNull } from "@/lib/clinic/schemas";
import { listReflections } from "@/lib/clinic/reflections";
import type { ClinicAdminReflections } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/clinic/admin/reflections?cohort=&user=&date=: the cohort's reflections, per student and per day. */
export const GET = appRoute({ auth: "admin" }, async ({ user, query }): Promise<ClinicAdminReflections> =>
  listReflections(clinicDb(), idOrNull(query.get("cohort")), { user: idOrNull(query.get("user")), date: query.get("date") || null }, isSuperAdmin(user.profile)),
);
