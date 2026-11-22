import { createAdminClient } from "@/lib/supabase/server";
import { wallReports, type AdminWallReport } from "@/lib/app-api/admin-r2b";
import { appRoute } from "@/lib/app-api/route";

export const runtime = "nodejs";

/** GET /api/app/v1/admin/wall-reports: open reports on the class wall, with what was reported and why. Anonymous authors stay anonymous. */
export const GET = appRoute({ auth: "admin" }, async (): Promise<{ v: 1; items: AdminWallReport[] }> => ({ v: 1, items: await wallReports(createAdminClient()) }));
