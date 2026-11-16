import { isSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { cohortsList } from "@/lib/app-api/admin-round2";
import { appRoute } from "@/lib/app-api/route";
import type { AdminCohorts } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/admin/cohorts: every cohort with its numbers (the website's Cohorts page, loadCohortSummaries and the roster). */
export const GET = appRoute({ auth: "admin" }, async ({ user }): Promise<AdminCohorts> => cohortsList(createAdminClient(), isSuperAdmin(user.profile)));
