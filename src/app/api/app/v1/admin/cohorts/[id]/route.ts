import { isSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { cohortDetail } from "@/lib/app-api/admin-round2";
import { appRoute } from "@/lib/app-api/route";
import type { AdminCohortDetail } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/admin/cohorts/:id: one cohort's members, numbers and messages (the website's cohort page: loadCohort, the roster, cohortFigures). */
export const GET = appRoute<{ id: string }>({ auth: "admin" }, async ({ user, params }): Promise<AdminCohortDetail> => cohortDetail(createAdminClient(), params.id, isSuperAdmin(user.profile)));
