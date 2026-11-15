import { activityView, adminActivity } from "@/lib/app-api/admin";
import { appRoute } from "@/lib/app-api/route";
import type { AdminActivity } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/admin/activity?view=live|behind|cohorts|all: on now, falling behind, cohorts (and the 30-day rows for "all"). */
export const GET = appRoute({ auth: "admin" }, async ({ query }): Promise<AdminActivity> => adminActivity(activityView(query.get("view"))));
